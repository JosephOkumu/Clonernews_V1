const ITEMS_PER_PAGE = 10;
const UPDATE_INTERVAL = 5000;
let currentPage = 0;
let postIds = [];
let lastCheckTime = Date.now();
let currentType = 'newstories';  // Default type
let lastPollId;  // Variable to store the last fetched poll ID

// Fetch post IDs from the given endpoint
async function fetchPostIds(type) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/${type}.json`);
    return response.json();
}

// Fetch a specific item by its ID
async function fetchItem(id) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return response.json();
}

// Convert Unix timestamp to a readable date
function formatDate(unixTime) {
    const date = new Date(unixTime * 1000);
    return date.toLocaleString();  // Adjust format if needed
}

// Create a post element with date and other details
function createPostElement(item) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <h2>${item.title}</h2>
        <p class="post-info">By: ${item.by} | Score: ${item.score} | Posted: ${formatDate(item.time)}</p>
        ${item.url ? `<a href="${item.url}" target="_blank">Read more</a>` : ''}
        <button class="comments-btn">Show Comments</button>
        <div class="comments" style="display: none;"></div>
    `;
    return postElement;
}

// Create a comment element with the comment date and details
function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <p>${comment.text}</p>
        <p class="post-info">By: ${comment.by} | Posted: ${formatDate(comment.time)}</p>
    `;
    return commentElement;
}

// Build and append poll option content
function buildPollOpt(pollOption, container) {
    container.innerHTML = `
        <p>${pollOption.text}</p>
        <p class="post-info">Score: ${pollOption.score}</p>
    `;
}

// Build and append the post content
function buildPostDiv(post, container) {
    container.innerHTML = `
        <h2>${post.title}</h2>
        <p class="post-info">By: ${post.by} | Score: ${post.score} | Posted: ${formatDate(post.time)}</p>
        ${post.url ? `<a href="${post.url}" target="_blank">Read more</a>` : ''}
    `;
}

// Load posts based on the current page and type
async function loadPosts() {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, postIds.length);
    const postsContainer = document.getElementById('posts');

    // Clear previous posts if on the first page
    if (currentPage === 0) {
        postsContainer.innerHTML = '';
    }

    for (let i = startIndex; i < endIndex; i++) {
        const item = await fetchItem(postIds[i]);
        if (item.type === 'poll') {
            // Handle poll separately
            await pollDemo(item.id);
        } else {
            // Handle other post types
            const postElement = createPostElement(item);
            postsContainer.appendChild(postElement);

            // Load comments for the post
            const commentsContainer = postElement.querySelector('.comments');
            if (item.kids && item.kids.length > 0) {
                for (let j = 0; j < Math.min(3, item.kids.length); j++) {
                    const comment = await fetchItem(item.kids[j]);
                    const commentElement = createCommentElement(comment);
                    commentsContainer.appendChild(commentElement);
                }
            } else {
                commentsContainer.innerHTML = '<p class="no-comments">No comments</p>';
            }

            // Add event listener for the comments button
            const commentsButton = postElement.querySelector('.comments-btn');
            commentsButton.addEventListener('click', toggleComments);
        }
    }

    // Increment page counter
    currentPage++;
}

// Toggle comments visibility
function toggleComments(event) {
    const button = event.target;
    const commentsContainer = button.nextElementSibling;

    if (commentsContainer.style.display === 'none') {
        commentsContainer.style.display = 'block';
        button.textContent = 'Hide Comments';
    } else {
        commentsContainer.style.display = 'none';
        button.textContent = 'Show Comments';
    }
}

// Fetch and display the first poll
async function pollDemo() {
    const content = document.getElementById('posts');
    content.innerHTML = ''; // Clear previous content

    try {
        // Fetch list of polls
        const polls = await fetchPostIds('polls'); // Adjust if necessary for the correct endpoint
        console.log('Fetched polls:', polls); // Debugging line

        if (polls.length > 0) {
            lastPollId = polls[0]; // Update lastPollId
            console.log('Displaying poll ID:', lastPollId); // Debugging line

            // Fetch the poll item by ID
            const poll = await fetchItem(lastPollId); 
            console.log('Fetched poll item:', poll); // Debugging line

            const pollDiv = document.createElement('div'); // Create a div for the poll
            pollDiv.className = 'post'; // Apply a class for styling
            content.appendChild(pollDiv); // Add the poll div to the content area

            buildPostDiv(poll, pollDiv); // Build and append the poll content

            const partContainer = document.createElement('div'); // Container for poll options
            pollDiv.insertBefore(partContainer, pollDiv.lastChild); // Insert it before the last child

            // Load poll options
            if (poll.parts) {
                for (const id of poll.parts) {
                    const partDiv = document.createElement('div'); // Create a div for each poll option
                    partContainer.appendChild(partDiv); // Append the option div to the container
                    partDiv.className = 'pollOpt'; // Apply a class for styling
                    try {
                        const part = await fetchItem(id); // Fetch and build poll option
                        buildPollOpt(part, partDiv);
                    } catch (err) {
                        console.log("Can't find poll part: " + err); // Handle errors
                    }
                }
            } else {
                partContainer.innerHTML = '<p>No poll options</p>'; // Handle case where no poll options exist
            }
        } else {
            content.innerHTML = '<p>No polls available</p>'; // Handle case where no polls exist
        }
    } catch (error) {
        console.error('Error fetching polls:', error); // Log any errors encountered
        content.innerHTML = '<p>Error fetching polls. Please try again later.</p>';
    }
}

// Check for new posts since the last check
async function checkForNewPosts() {
    const newPostIds = await fetchPostIds(currentType);
    const newPosts = newPostIds.filter(id => !postIds.includes(id));

    if (newPosts.length > 0) {
        const alertElement = document.getElementById('new-stories-alert');
        alertElement.textContent = `${newPosts.length} new posts available. Refresh to see them.`;
        alertElement.style.display = 'block';
        postIds = newPostIds;
    }

    lastCheckTime = Date.now();
}

// Event listeners for buttons
document.getElementById('stories-btn').addEventListener('click', async () => {
    currentType = 'topstories';
    postIds = await fetchPostIds(currentType);
    currentPage = 0;
    await loadPosts();
});

document.getElementById('newest-btn').addEventListener('click', async () => {
    currentType = 'newstories';
    postIds = await fetchPostIds(currentType);
    currentPage = 0;
    await loadPosts();
});

document.getElementById('jobs-btn').addEventListener('click', async () => {
    currentType = 'jobstories';
    postIds = await fetchPostIds(currentType);
    currentPage = 0;
    await loadPosts();
});

document.getElementById('polls-btn').addEventListener('click', async () => {
    currentType = 'polls';
    postIds = await fetchPostIds(currentType);
    currentPage = 0;
    await pollDemo(); // Fetch and display polls
});

// Event listener for loading more posts
document.getElementById('load-more').addEventListener('click', async () => {
    if (currentPage * ITEMS_PER_PAGE < postIds.length) {
        await loadPosts();
    } else {
        document.getElementById('load-more').textContent = 'No more posts';
        document.getElementById('load-more').disabled = true;
    }
});

// Initialize the page by fetching the post IDs and loading posts
(async function init() {
    postIds = await fetchPostIds(currentType);
    await loadPosts();
    setInterval(checkForNewPosts, UPDATE_INTERVAL);

    // Update button state based on available posts
    if (postIds.length <= ITEMS_PER_PAGE) {
        document.getElementById('load-more').style.display = 'none';
    }
})();
