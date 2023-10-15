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

function insertLineBreaks(text, maxCharacters) {
    // 함수는 먼저 text 매개변수가 거짓인지(비어 있거나 정의되지 않음) 확인. text가 비어 있거나 정의되지 않은 경우 함수는 동일한 입력 텍스트를 반환함.
    if (!text) return text;

    // text가 비어 있지 않으면 함수는 chunks라는 빈 배열을 초기화함. 이 배열은 줄 바꿈을 사용하여 텍스트 덩어리를 저장하는 역할을 함.
    const chunks = [];
    // 띄어쓰기가 없는 한 개의 문자열의 인덱스
    let j = 0;

    for (let i = 0; i < text.length; i++) {
        // 공백을 만나면, 문자열의 길이를 세는 j를 0으로 초기화.
        if (text[i] === ' ') {
            j = 0;
        }

        chunks.push(text[i]);
        j++;

        // 띄어쓰기 없이 maxCharacters까지 왔다면, 강제로 띄어쓰기 삽입 후, j = 0으로 초기화.
        if (j === maxCharacters) {
            chunks.push(' ')
            j = 0;
        }
    }
    
    return chunks;
}

const renderPortfolioFrame = (data, existingPreferences) => {
    return (
        <div>
            <div style={{ marginLeft: '20%', marginRight: '20%', marginTop: '20px', marginBottom: '20px' }}>
                <div>
                    <div style={{ fontSize: '35px' }}>
                        <strong>Welcome To</strong> <i>{data.nickName}</i> <strong>'s page ❤️‍🔥</strong>                            
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '12px' }}>
                            <strong>CONTACT : </strong>
                                {data.email}
                        </div>
                        <div style={{ fontSize: '12px' }}>
                            <strong>조회수 : </strong>
                            {data.viewCount}
                        </div>
                    </div>
                </div>
            </div>

                    {/**  borderBottom: '3px solid black'은 <hr> 요소 하단에 검은색 실선 테두리를 추가하여 더 두껍고 굵게 표시합니다. '3px' 값을 조정하여 원하는 대로 두껍거나 얇게 만들 수 있습니다. */}
                    <hr style={{ marginLeft: '15%', marginRight: '15%', borderBottom: '0.1px solid black' }} />

                <div style={{ marginLeft: '20%', fontSize: '12px' }}>
                    <strong>첨부 파일:</strong> {data.fileUrl}
                </div>

                    <Row justify="center" style={{ marginTop: '20px' }}>
                        <Col span={16}>
                            <Row>
                                <Col span={14}>
                                    <Card title="ABOUT" style={{ height: '100%' }}>
                                    <h6>Nick Name</h6>
                                        {data && data.nickName}
                                        <br></br>
                                        <br></br>
                                        <h6>Brief Introduction</h6>
                                        {data && data.shortIntroduce ? (
                                            data.shortIntroduce
                                        ) : (
                                            <p>No introduction available</p>
                                        )}
                                    </Card>
                                </Col>
                                <Col span={10}>
                                    
                                    <Card title="관심 분야 선호도" style={{ height: '100%' }}>
                                        {renderPreferenceBar('web', existingPreferences)}
                                        {renderPreferenceBar('app', existingPreferences)}
                                        {renderPreferenceBar('game', existingPreferences)}
                                        {renderPreferenceBar('ai', existingPreferences)}
                                    </Card>
                                    

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={16}>
                            <Card title="경력">
                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                    {/** 받아온 데이터에 공백이 없으면, 40번째 글자 이후에 강제로 공백을 넣어주는 함수 */}
                                    {/** Card안에 데이터를 넣는 경우 발생하는 문제인 것 같음. */}
                                    {data && insertLineBreaks(data.introduce, 45)}
                                </div>
                            </Card>
                        </Col>
                    </Row>
        </div>

    )

}

  
export { renderPosts, renderPortfolioFrame};