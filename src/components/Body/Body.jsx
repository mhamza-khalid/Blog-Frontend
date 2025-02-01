import './Body.css';
import Card from '../Card/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

const Body = () => {
  // State to store posts
  const [posts, setPosts] = useState(null);

  // Fetch posts on mount
  useEffect(() => {
    async function getAllPosts() {
      try {
        const response = await fetch('http://localhost:3000/posts');
        const posts = await response.json();
        const publishedPosts = posts.filter(post => post.isPublished);
        if (response.status === 500) {
          throw new Error(posts.error);
        }

        console.log(posts);
        setPosts(publishedPosts);
      } catch (err) {
        console.error('Error getting posts', err);
      }
    }

    getAllPosts();
  }, []);

  // Show loading state
  if (!posts) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        padding: '20rem 0' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render posts
  return (
    <div className="body-container">
        {/* Welcome Message */}
        <div className="welcome-section">
            <h2 className="welcome-title">Welcome to Odin Blog!</h2>
            <p className="welcome-description">
                Where you can read and share knowledge with fellow Odinators 🚀
            </p>
        </div>

        {/* Blog Posts */}
        <div className="blog-grid">
            {posts
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map((post) => (
                  <Card key={post.post_id} data={post} /> 
            ))}
        </div>
        
    </div>
);
};

export default Body;
