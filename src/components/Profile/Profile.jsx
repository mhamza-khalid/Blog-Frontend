import AspectRatio from '@mui/joy/AspectRatio';
import CircularProgress from '@mui/material/CircularProgress';
import Boxx from '@mui/material/Box';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import PostsTable from '../Posts-Table/table';
import validateToken from '../../helper-functions/validate-token';
import './profile.css'
import BlogCard from '../Card/Card';


export default function UserCard() {

    //now we need the signed in users informatiom
    //token in the local storage can be sent to server for decoding

    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState(null)
    const [render, setRender] = useState(false)
    const [likedPosts, setLikedPosts] = useState(null)
    const [allPosts, setAllPosts] = useState(null)


    useEffect(() => {
        async function getPosts() {
            let data = await validateToken()
            try {
                const response = await fetch(`https://blog-backend-production-6422.up.railway.app/users/${data.id}`)
                let user = await response.json()
                console.log(user)
                setUser(user)
            }
            catch (error) {
                console.error('Error:', error);
            }
            try {
                const response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts/user/${data.id}`)
                let userPosts = await response.json()
                console.log(userPosts)
                setPosts(userPosts.posts)
            }
            catch (error) {
                console.error('Error:', error);
            }
            try {
                const response = await fetch(`https://blog-backend-production-6422.up.railway.app/posts`)
                let _allPosts = await response.json()
                console.log('All posts', _allPosts)

                setAllPosts(_allPosts)
            }
            catch (error) {
                console.error('Error:', error);
            }
        }
        getPosts()

        async function getUserLikedPosts() {
            let data = await validateToken()
            try {
                const response = await fetch(`https://blog-backend-production-6422.up.railway.app/users/${data.id}/liked`);
                let _likedPosts = await response.json();
                console.log('Posts I have liked', _likedPosts)
                _likedPosts = _likedPosts.user_liked_posts
                let likedPostsIds = _likedPosts.map((post) => post.postId)
                console.log(likedPostsIds)
                setLikedPosts(likedPostsIds);
            } catch (err) {
                console.error('Error getting posts', err);
            }
        }

        getUserLikedPosts()


    }, [render])



    if (!user) {
        console.log('Loading')
        return (
            <Boxx sx={{ display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        padding: '20rem 0' }}>
        <CircularProgress />
            </Boxx>
        )
    }
    return (
        <Container maxWidth="xl">
            <Box
                sx={{
                    width: '100%',
                    padding: '1rem 0',
                    position: 'relative',
                    overflow: { xs: 'auto', sm: 'initial' },
                }}
            >
                <Card
                    orientation="horizontal"
                    sx={{
                        width: '100%',
                        flexWrap: 'wrap',
                    }}
                >
                    <AspectRatio flex ratio="1" maxHeight={182} sx={{ minWidth: 182 }}>
                        <img
                            src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp"
                            srcSet="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp"
                            loading="lazy"
                            alt=""
                        />
                    </AspectRatio>
                    <CardContent>
                        <Typography sx={{ fontSize: 'xl', fontWeight: 'lg' }}>
                            {user.username}
                        </Typography>
                        <Typography
                            level="body-sm"
                            textColor="text.tertiary"
                            sx={{ fontWeight: 'lg' }}
                        >
                            {user.is_author ? 'Author' : 'User'}
                        </Typography>
                        <Typography
                            level="body-sm"
                            textColor="text.tertiary"
                            sx={{ fontWeight: 'lg' }}
                        >
                            {user.email}
                        </Typography>
                        <Sheet
                            sx={{
                                bgcolor: 'background.level1',
                                borderRadius: 'sm',
                                p: 1.5,
                                my: 1.5,
                                display: 'flex',
                                gap: 2,
                                '& > div': { flex: 1 },
                            }}
                        >
                            <div>
                                <Typography level="body-xs" sx={{ fontWeight: 'lg' }}>
                                    Posts
                                </Typography>
                                <Typography sx={{ fontWeight: 'lg' }}>{user._count?.posts ?? 0}</Typography>
                            </div>
                            <div>
                                <Typography level="body-xs" sx={{ fontWeight: 'lg' }}>
                                    Comments
                                </Typography>
                                <Typography sx={{ fontWeight: 'lg' }}>{user._count?.comments ?? 0}</Typography>
                            </div>
                        </Sheet>
                    </CardContent>
                </Card>
            </Box>

            <h2 className='header'>My Posts</h2>
            {posts ?
                <PostsTable posts={posts} username={user.username} render={render} setRender={(val) => { setRender(val) }}></PostsTable>
                : ''}

            <h2 className='header'>Posts Liked by me</h2>

            <div className="blog-grid">

                {allPosts && likedPosts ? (
                    allPosts
                        .filter((post) => likedPosts.includes(post.post_id))
                        .map((post) => (
                            <BlogCard key={post.post_id} data={post} />
                        ))
                ) : <></>
                }
            </div>





        </Container>
    );
}

