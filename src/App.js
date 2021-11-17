import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col } from "antd";
import Post from "./components/Post";
import { Typography, Button, Affix } from "antd";
import BaseForm from "./components/BaseForm";
const { Title } = Typography;

const worker = axios.create({
  baseURL: "https://worker.jison0709.workers.dev",
  timeout: 1000,
});

const RenderCards = (posts, likeMethod, dislikeMethod) => {
  if (!posts.length) {
    return <Title>No posts!</Title>;
  } else {
    posts.sort((post1, post2) => post2.date - post1.date);
    return posts.map((post) => {
      return (
        <Row key={post.id}>
          <Col span={24}>
            <div className="post-container">
              <Post
                title={post.title}
                user={post.username}
                content={post.content}
                postId={post.id}
                likeMethod={likeMethod}
                dislikeMethod={dislikeMethod}
                postLikes={post.likes}
                postDislikes={post.dislikes}
                date={new Date(post.date) //formatting it to be date & time without seconds
                  .toLocaleString()
                  .replace(/(.*)\D\d+/, "$1")}
              />
            </div>
          </Col>
        </Row>
      );
    });
  }
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [createButtonClicked, setCreateButtonClicked] = useState(false);
  useEffect(() => {
    worker
      .get("/posts")
      .then(function (response) {
        setPosts(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const handleCancelClick = () => {
    setCreateButtonClicked(false);
  };
  //creates a new post when user submits modal
  const handleSubmit = (form) => {
    let newPost = {
      title: form.title,
      username: form.username,
      content: form.content,
      date: Date.now(),
      likes: 0,
      dislikes: 0,
    };
    worker
      .post("/posts", JSON.stringify(newPost))
      .then(function (response) {
        setCreateButtonClicked(false);
        setPosts([...posts, response.data]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleLikeButtonClick = (postId) => {
    let data = {
      id: postId,
      likes: true,
    };
    worker
      .patch("/posts", JSON.stringify(data))
      .then(function (response) {
        setPosts(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleDislikeButtonClick = (postId) => {
    let data = {
      id: postId,
      dislikes: true,
    };
    worker
      .patch("/posts", JSON.stringify(data))
      .then(function (response) {
        setPosts(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const RenderModal = (createButtonClicked, numberOfPosts) => {
    if (numberOfPosts) {
      if (createButtonClicked) {
        return (
          <>
            {/* renders the modal when user clicks the button */}
            <BaseForm
              formName="Post"
              onCancelClick={handleCancelClick}
              onSubmission={handleSubmit}
              buttonClicked={createButtonClicked}
            />
          </>
        );
      } else {
        return (
          //creates a sticky button
          <Affix offsetBottom={60}>
            <Button
              type="primary"
              onClick={() => setCreateButtonClicked(true)}
              style={{ float: "right", marginRight: 25 }}
              shape="circle"
            >
              +
            </Button>
          </Affix>
        );
      }
    }
  };
  return (
    <div className="App">
      {posts.length ? (
        <>
          <Title style={{ marginTop: 25 }} className="title">
            Your Feed
          </Title>
          {RenderCards(posts, handleLikeButtonClick, handleDislikeButtonClick)}
        </>
      ) : (
        <>
          <Title style={{ marginTop: 25 }} className="title">
            Create a new post
          </Title>
          <Button onClick={() => setCreateButtonClicked(true)}>New Post</Button>
          {createButtonClicked ? (
            <BaseForm
              formName="Post"
              onCancelClick={handleCancelClick}
              onSubmission={handleSubmit}
              buttonClicked={createButtonClicked}
            />
          ) : (
            <></>
          )}
        </>
      )}
      {RenderModal(createButtonClicked, posts.length)}
    </div>
  );
};

export default App;
