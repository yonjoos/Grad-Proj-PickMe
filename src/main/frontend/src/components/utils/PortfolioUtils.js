import { Button, Card, Row, Col, Progress} from 'antd';

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



// Component
// RETURN : Bar-graph of fields of interest
const renderPreferenceBar = (field, existingPreferences) => {

    const preferenceValue = 1 && existingPreferences[field];
    return (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <div style={{ width: '100px', textAlign: 'left', marginRight: '10px' }}>{field}:</div>
                <Progress percent={preferenceValue * 25} showInfo={false} strokeColor={getBarColor(field)} />
            </div>
        </div>
    );
};


// Component (for > Component-renderPreferenceBar)
    // INPUT : fields of interests
    // OUTPUT : 필드에 따른 색상코드
const getBarColor = (field) => {
    if (field === "web") {
        return '#FE708F';
    } else if (field === "app") {
        return '#f9f56e';
    } else if (field === "game") {
        return '#83edff';
    } else {
        return '#91e2c3';
    }
};
  
  export { renderPosts, renderPreferenceBar };