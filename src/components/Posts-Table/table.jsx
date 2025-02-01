import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function PostsTable({ posts, username, render, setRender }) {
    console.log('Posts', posts);
    const navigate = useNavigate();  
    const [showModal, setShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // Helper function to strip HTML tags and truncate body
    const processBody = (html, maxLength = 100) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        return plainText.length > maxLength ? `${plainText.slice(0, maxLength)}...` : plainText;
    };

    const handlePublishToggle = async (post) => {
        const url = `https://blog-backend-production-6422.up.railway.app/posts/${post.post_id}/${post.isPublished ? 'unpublish' : 'publish'}`;
        
        try {
            const response = await fetch(url, { method: 'PUT' });
            if (response.status === 200) {
                setRender(!render);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const confirmDeletePost = (postId) => {
        setPostToDelete(postId);
        setShowModal(true);
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;

        try {
            const response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts/${postToDelete}`, { method: 'DELETE' });

            if (response.status === 200) {
                setRender(!render);
            }
        } catch (err) {
            console.log(err);
        }

        setShowModal(false);
    };

    const handleViewPost = (postID, name) => {
        navigate(`/view/${postID}/${name}`);
    };

    const handleEdit = (postID) =>{
        //now we have to go to the editor website and send in the url the token
        let token = localStorage.getItem("token");
        window.open(`https://odin-blog-editor.netlify.app?token=${encodeURIComponent(token)}&update=${true}&postId=${postID}`,"_blank");
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>Body</StyledTableCell>
                            <StyledTableCell>Published</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <StyledTableRow key={post.post_id}>
                                <StyledTableCell>{post.title}</StyledTableCell>
                                <StyledTableCell>{processBody(post.body)}</StyledTableCell>
                                <StyledTableCell>{post.isPublished ? 'Yes' : 'No'}</StyledTableCell>
                                <StyledTableCell>
                                    <div style={{ display: 'flex' }}>
                                        <Button
                                            variant="contained"
                                            color={post.isPublished ? 'warning' : 'primary'}
                                            onClick={() => handlePublishToggle(post)}
                                            sx={{ marginRight: 1, width: '118px' }}
                                        >
                                            {post.isPublished ? 'Unpublish' : 'Publish'}
                                        </Button>
                                        <Button
                                            sx={{ marginRight: 1, width: '100px' }}
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleEdit(post.post_id)}
                                        >
                                           Edit 
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => confirmDeletePost(post.post_id)}
                                            sx={{ marginRight: 1 }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            sx={{ width: '100px' }}
                                            variant="outlined"
                                            color="info"
                                            onClick={() => handleViewPost(post.post_id, username)}
                                        >
                                            {post.isPublished ? 'View' : 'Preview'}
                                        </Button>
                                    </div>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Modal */}
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModal(false)} color="primary">Cancel</Button>
                    <Button onClick={handleDeletePost} color="secondary" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

PostsTable.propTypes = {
    posts: PropTypes.array.isRequired,
    username: PropTypes.string.isRequired,
    render: PropTypes.bool.isRequired,
    setRender: PropTypes.func.isRequired,
};
