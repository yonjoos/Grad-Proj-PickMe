import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Row, Col, Radio, Progress } from 'antd';
import { request } from '../../../hoc/request';
import { renderPosts, renderPortfolioFrame } from '../../utils/PortfolioUtils';


function PortfolioNotifyPage() {
    const navigate = useNavigate();
    const { nickName } = useParams();
    const lastVisitedEndpoint = useSelector(state => state.endpoint.lastVisitedEndpoint);

    const [postData, setPostData] = useState([]);
    const [loadPosts, setloadPosts] = useState("more");

    const [data, setData] = useState(null);
    const [hasPortfolio, setHasPortfolio] = useState('');
    const [existingPreferences, setExistingPreferences] = useState({
        web: 0,
        app: 0,
        game: 0,
        ai: 0
    });


    // PortfolioPage에 들어오면, Get방식으로 백엔드에서 데이터를 가져와서 data에 세팅한다.
    useEffect(() => {
        request('GET', `/getUserPortfolio?nickName=${nickName}`, {})
            .then((response) => {
                setData(response.data);
                setHasPortfolio(response.data.isCreated);
                setExistingPreferences({
                    web: response.data.web,
                    app: response.data.app,
                    game: response.data.game,
                    ai: response.data.ai
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [nickName]);

    // 아무런 정보도 없는 유저의 포트폴리오에 접근 시 (존재하지 않는 유저의 포트폴리오에 접근 시) /portfolio로 강제로 이동
    useEffect(() => {
        if (hasPortfolio === null) {
            navigate('/portfoliocard');
        }
    }, [hasPortfolio]);



    /*
    COMPONENTS #############################################################################################################
    COMPONENTS #############################################################################################################
    */


    // 백엔드에서 받아온 데이터에 공백이 없으면, maxCharacters번째 글자 이후에 공백을 넣어주는 함수
    // text: 덩어리로 나누어 줄 바꿈을 삽입하려는 입력 텍스트.
    // maxCharacters: 줄 바꿈을 삽입하기 전의 최대 문자 수.
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

    // 목록으로 돌아가기 버튼 클릭
    const handleGoBackClick = () => {
        navigate(lastVisitedEndpoint);
    };



    
    

    /*
    HANDLER #############################################################################################################
    HANDLER #############################################################################################################
    */


    // Handler
    // OnClick : FETCH PostsListsDTO, switch 'loadPosts' status
    const onLoadPosts = () => {

        if(loadPosts == "more"){

            request('GET', `/getOtherUsersPosts?nickName=${nickName}`)
            .then((response) => {

                setPostData(response.data);
                setloadPosts("fold");

            })
            .catch((error) => {

                console.error("Error fetching posts:", error);

            });
        }
        else if(loadPosts == "fold"){
            setloadPosts("more");
        }

    };

    // Handler
    // onClick : move to post's detail page
    const onClickPosts = (post) => {

        if(post.postType == "PROJECT"){navigate(`/project/detail/${post.id}`);}
        else{navigate(`/study/detail/${post.id}`);}
        

    }

    /*
    RETURN #####################################################################################################################
    RETURN #####################################################################################################################
    */

    return (
        // 포트폴리오 업로드 후 F5를 누르지 않으면 데이터가 들어오지 않는 문제를 data 안에 들어있는 isCreated사용과 삼항 연산자를 통해 직접적으로 해결.
        <div>
            <div style={{ marginLeft: '15%', marginRight: '15%' }}>
                {/** navigate(-1)을 통해, 바로 이전에 방문했던 페이지로 돌아갈 수 있음 */}
                <Button type="primary" onClick={() => navigate(-1)}>
                    이전 페이지
                </Button>

            </div>

            {/** 아직 포트폴리오를 만들지 않았다면? */}
            {data && !data.isCreated ? (
                <div style={{ marginLeft: '15%' }}>
                    <br />
                    <h2> {data.nickName} 님의 포트폴리오가 아직 작성되지 않았습니다.</h2>
                    <br />
                    <br />
                </div>
            ) : (
                <div>
                    {data && renderPortfolioFrame(data, existingPreferences)}
                    <br></br>
                    <Row justify="center">
                        <Col span = {16}>
                            <Card >
                                <Row justify="space-between">
                                    <Col span={8}>
                                        Post
                                    </Col>
                                    <Col span={8} style={{ textAlign: 'right' }}>
                                        <div onClick={onLoadPosts}>
                                            <strong>{loadPosts}</strong>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    {postData && postData.length > 0 ? (
                        renderPosts(postData, loadPosts, onClickPosts)
                        ) : (
                            <div></div>

                    )}
                    <br />
                    <br />
                </div>
            )}
        </div>
    );
}

export default PortfolioNotifyPage;