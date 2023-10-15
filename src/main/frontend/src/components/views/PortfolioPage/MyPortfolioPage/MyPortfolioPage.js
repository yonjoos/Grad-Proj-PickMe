import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { uploadPortfolioSuccess, deletePortfolioSuccess } from '../../../../_actions/actions';
import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, message } from 'antd';
import { request, setHasPortfolio } from '../../../../hoc/request';
import { renderPosts, renderPortfolioFrame } from '../../../utils/PortfolioUtils';


function MyPortfolioPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);    // 모달이 보이는지 안보이는지 설정하기 위한 애

    const [data, setData] = useState(null);
    const [postData, setPostData] = useState([]);
    const [loadPosts, setloadPosts] = useState("more");
    const [existingPreferences, setExistingPreferences] = useState({
        web: 0,
        app: 0,
        game: 0,
        ai: 0
    });
    

    /*
    useEffect ################################################################################################################
    useEffect ################################################################################################################
    */
    // PortfolioPage에 들어오면, Get방식으로 백엔드에서 데이터를 가져와서 data에 세팅한다.
    useEffect(() => {
        request('GET', '/getPortfolio', {})
            .then((response) => {
                setData(response.data);
                setExistingPreferences({
                    web: response.data.web,
                    app: response.data.app,
                    game: response.data.game,
                    ai: response.data.ai
                });
                // dispatch를 통해 현재 상태를 세팅해줘야 F5 눌렀을 때 에러가 안남!!
                if (response.data.isCreated) {
                    dispatch(uploadPortfolioSuccess(true));
                } else {
                    dispatch(deletePortfolioSuccess());
                }

                console.log('hihihi', response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [dispatch]);


    /*
    Components ################################################################################################################
    Components ################################################################################################################
    */

        

    /*
    Handler ################################################################################################################
    HAndler ################################################################################################################
    */

    // Handler
    // OnClick : FETCH PostsListsDTO, switch 'loadPosts' status
    const onLoadPosts = () => {

        if(loadPosts == "more"){
        
            const queryParams = new URLSearchParams({ //URLSearchParams 이 클래스는 URL에 대한 쿼리 매개변수를 작성하고 관리하는 데 도움. 'GET' 요청의 URL에 추가될 쿼리 문자열을 만드는 데 사용됨.
                size: 3, //페이징을 할 크기(현재는 한페이지에 3개씩만 나오도록 구성했음)
            });

            request('GET', `/getUsersPosts?${queryParams}`)
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


    // 포트폴리오 업로드 버튼 클릭 시 해당 엔드포인터로 이동
    const onClickUploadHandler = () => {
        navigate('/portfolio/upload');
    }

    // 포트폴리오 업데이트 버튼 클릭 시 해당 엔드포인터로 이동
    const onClickUpdateHandler = () => {
        navigate('/portfolio/update');
    }

    const showDeleteModal = () => {
        setIsDeleteModalVisible(true);
    };

    const hideDeleteModal = () => {
        setIsDeleteModalVisible(false);
    };

    const handleDelete = () => {
        request('POST', '/deletePortfolio', {}) // Adjust the endpoint accordingly
            .then((response) => {
                alert('포트폴리오 삭제가 완료되었습니다.'); // 삭제 성공 메시지 띄우기
                setHasPortfolio(false);                     // 포트폴리오를 삭제했으므로, 포트폴리오 상태를 false로 변경
                dispatch(deletePortfolioSuccess()); // Dispatch를 통해 deletePortfolioSuccess()를 실행하고, 상태를 변경
                navigate('/'); // Redirect or perform any other action
            })
            .catch((error) => {
                console.error("Error deleting portfolio:", error);
                message.warning('포트폴리오 삭제에 실패했습니다.');
            });

        hideDeleteModal();
    };



    /*
    RETURN ################################################################################################################
    RETURN ################################################################################################################
    */
    return (
        // 포트폴리오 업로드 후 F5를 누르지 않으면 데이터가 들어오지 않는 문제를 data 안에 들어있는 isCreated사용과 삼항 연산자를 통해 직접적으로 해결.
        <div>
            {/** 아직 포트폴리오를 만들지 않았다면? */}
            {data && !data.isCreated ? (
                <div>
                    <h2>아직 포트폴리오가 작성되지 않았습니다.</h2>
                    <h2>포트폴리오를 만들어주세요!!</h2>
                    <br />
                    <br />
                    <Row justify="center">
                        <Col>
                            <Button type="primary" onClick={onClickUploadHandler}>
                                포트폴리오 등록
                            </Button>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>
                    {data && renderPortfolioFrame(data, existingPreferences)}
                    <br />
                    <Row justify="center">
                        <Col span={16}>
                            <Card>
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

                    <Row justify="center">
                        <Col>
                            <Button type="primary" style={{ marginRight: '10px' }} onClick={onClickUpdateHandler}>
                                포트폴리오 수정
                            </Button>
                            <Button type="primary" style={{ marginLeft: '10px' }} onClick={showDeleteModal}>
                                포트폴리오 삭제
                            </Button>
                        </Col>
                    </Row>

                    {/* 삭제 모달 */}
                    <Modal
                        title="포트폴리오 삭제"
                        open={isDeleteModalVisible}
                        onCancel={handleDelete}
                        onOk={hideDeleteModal}
                        okText="아니오"
                        cancelText="예"
                    >
                        <p>정말로 포트폴리오를 삭제하시겠습니까?</p>
                    </Modal>
                </div>
            )}
        </div>
    );
}

export default MyPortfolioPage;