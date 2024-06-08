const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const { default: axios } = require('axios');

const router = express.Router();

const userDatas = [];

router.get('/', async (req, res) => {
  const {start , limit} = req.query;
  const posts = await fetchPosts({start, limit});
  const postsWithImages = await Promise.all(
    posts.map(async (post)=>{
      if(!userDatas[post.userId]){
        const userData = await fetchUserById(post.userId);
        userDatas[post.userId] = userData;
      }
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
        const images = response.data.map((photo)=>({url : photo.url}));
        const user = {
          name : userDatas[post.userId].name,
          email :userDatas[post.userId].email,
        }
        return {
          ...post,
          images,
          user,
        };
      } catch (error) {
        console.error(`Error fetching photos for post ${post.id}: ${error}`);
        return {
          ...post,
          images: [],
        };
      }
    })
  );

  res.json(postsWithImages);
});

module.exports = router;
