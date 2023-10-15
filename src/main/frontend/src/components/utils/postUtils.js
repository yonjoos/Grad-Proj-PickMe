import { Button, Card, Row, Col} from 'antd';

// Component
    // INPUT : PostsListsDTO
    // RETURN : Posts Lists <Card> components
const renderPosts = (posts, loadPosts, onClickPosts) => {
    if (loadPosts === "fold") {
      return posts.map((post) => (
        <Row justify="center" key={post.id}>
                <Col span={16}>
                    <Card 
                    onClick={() => onClickPosts(post)}
                    style = {{height:'150px'}}
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div style={{ fontWeight: 'bold' }}>{post.title}</div>
                            <div style={{ fontSize: '12px', color: 'gray' }}>{post.postType}</div>
                        </div>
                    }>
                        <div>
                            {post.web ? "#Web " : ""}{post.app ? "#App " : ""}{post.game ? "#Game " : ""}{post.ai ? "#AI " : ""}
                        </div>
                        <div style = {{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'}}>
                            {post.briefContent}
                        </div>
                    </Card>
                </Col>
                </Row>
      ));
    } else {
      return <div></div>;
    }
  };


  
  export { renderPosts };