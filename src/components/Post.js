import { Card, Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

//custom component for card actions
const CardButton = ({ buttonIcon, method, quantity, id }) => {
  return (
    <Button icon={buttonIcon} onClick={() => method(id)} type="text">
      {quantity}
    </Button>
  );
};

const Post = (props) => {
  return (
    <Card
      title={props.title}
      style={{ width: 1000 }}
      extra={props.date}
      bodyStyle={{ textAlign: "left", overflowWrap: "break-word" }}
      headStyle={{ textAlign: "left" }}
      actions={[
        <CardButton
          buttonIcon={<LikeOutlined />}
          id={props.postId}
          method={props.likeMethod}
          quantity={props.postLikes}
        />,
        <CardButton
          buttonIcon={<DislikeOutlined />}
          id={props.postId}
          method={props.dislikeMethod}
          quantity={props.postDislikes}
        />,
      ]}
    >
      <b>{props.user}: </b>
      {props.content}
    </Card>
  );
};

export default Post;
