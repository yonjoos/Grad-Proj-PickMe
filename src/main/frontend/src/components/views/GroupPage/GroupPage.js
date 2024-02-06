import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { truncateString, formatDate, formatDateTime } from "../../utils/common";
//import { useDispatch } from 'react-redux';
import {
  Divider,
  Row,
  Col,
  Button,
  Card,
  Pagination,
  Modal,
  message,
} from "antd";
import {
  request /*, setLastVisitedEndpoint, setLastLastVisitedEndpoint, setLastLastLastVisitedEndpoint*/,
} from "../../../hoc/request";
//import { lastVisitedEndpoint } from '../../../_actions/actions'
import "./GroupPage.css";

function GroupPage() {
  const navigate = useNavigate();
  //const dispatch = useDispatch();

  const [data, setData] = useState([]); // 백엔드에서 동적 쿼리를 바탕으로 현재 페이지에서 보여질 게시물 목록들 세팅
  const [postsOption, setPostsOption] = useState("writer"); // 내가 쓴 글이면 postsOption === writer / 내가 지원한 글이면 postsOption === applicant
  const [currentPage, setCurrentPage] = useState(0); // Java 및 Spring Boot를 포함한 페이징은 일반적으로 0부터 시작하므로 처음 이 페이지가 세팅될 떄는 0페이지(사실상 1페이지)로 삼음
  const [totalPages, setTotalPages] = useState(0); // 동적 쿼리를 날렸을 때 백엔드에서 주는 현재 상태에서의 total 페이지 수 세팅을 위함
  const [sortOption, setSortOption] = useState("latestPosts"); //등록순(내가 작성한 게시물): latestPosts 최신 등록순(내가 지원한 게시물)/ 모집마감순: nearDeadline
  const [isModalVisible, setIsModalVisible] = useState(false); // 유저 승인 모달이 보이는지 여부 설정
  const [cancelModalVisible, setCancelModalVisible] = useState(false); // 유저 승인 취소 모달이 보이는지 여부 설정
  const [nickName, setNickName] = useState(null); // 승인할 때 필요한 유저 nickName을 저장
  const [postsId, setPostsId] = useState(); // 승인할 때 필요한 게시물 ID를 저장
  const [profileImage, setProfileImage] = useState(null); //프사 띄우는 용도

  const pageSize = 3; // 현재 게시물 수가 적으므로 페이징을 3개 단위로 하였음

  const myNickName = window.localStorage.getItem("user_nickname");

  // 내가 보고있는 게시물이 내가 쓴 글인지(postsOption === writer) 또는 내가 지원한 글인지(postsOption === applicant)
  // 현재 사용자가 하이라이트한 페이지 번호 상태,
  // 등록순/마감일순에 대한 정렬 옵션,
  // 를 기반으로 백엔드에 동적쿼리 보냄
  useEffect(() => {
    const queryParams = new URLSearchParams({
      //URLSearchParams :'GET' 요청의 URL에 추가될 쿼리 문자열을 만드는 데 사용됨.
      postsOption: postsOption, // 내가 쓴 글인가? 내가 지원한 글인가?
      page: currentPage, //현재 페이지 정보
      size: pageSize, //페이징을 할 크기(현재는 한페이지에 3개씩만 나오도록 구성했음)
      sortOption: sortOption, // 등록순, 모집일자 마감순
    });

    request("GET", `/getGroupPosts?${queryParams}`)
      .then((res) => {
        setData(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((rej) => {
        console.error(rej);
      });
  }, [postsOption, currentPage, sortOption]);

  // 페이징 된 각 게시물 목록 하나를 클릭하면 그에 해당하는 게시물의 디테일 페이지로 navigate함
  const handleRowClick = (postsId, postType) => {
    postType === "PROJECT"
      ? navigate(`/project/detail/${postsId}`)
      : navigate(`/study/detail/${postsId}`);
  };

  // 등록순, 마감일 순 버튼이 눌러지면 현재 선택된 버튼으로 세팅하고, 페이지는 0번으로 간다
  const handleSortOptionChange = (option) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  // 작성한 글 또는 지원한 글 버튼이 눌러지면 현재 선택된 버튼으로 세팅하고, 페이지는 0번으로 간다
  const handlePostsOptionChange = (option) => {
    setPostsOption(option);
    setCurrentPage(0);

    setSortOption("latestPosts"); // 기본 설정은 최신등록순/등록순으로 고정
  };

  // 승인하려는 유저의 닉네임(nickName)과 게시물 아이디(postsId)를 받아서 승인 허가
  const handleApproveUser = async (nickName, postsId) => {
    const queryParams = new URLSearchParams({
      nickName: nickName, // 닉네임
      postsId: postsId, // 게시물 ID
      page: currentPage, //현재 페이지 정보
      size: pageSize, //페이징을 할 크기(현재는 한페이지에 3개씩만 나오도록 구성했음)
      sortOption: sortOption, // 등록순, 모집일자 마감순
    });

    request("PUT", `/posts/approve?${queryParams}`)
      .then((res) => {
        setData(res.data.content); // 변경된 데이터를 갖고 새롭게 data를 세팅함
        setIsModalVisible(false); // 모달은 안보이게 설정
        setCancelModalVisible(false);
      })
      .catch((err) => {
        console.error(" !Error! approving user : ", err);
      });
  };

  // 승인 취소하려는 유저의 닉네임(nickName)과 게시물 아이디(postsId)를 받아서 승인 허가 취소
  const handleCancelApproval = async (nickName, postsId) => {
    const queryParams = new URLSearchParams({
      nickName: nickName, // 닉네임
      postsId: postsId, // 게시물 ID
      page: currentPage, //현재 페이지 정보
      size: pageSize, //페이징을 할 크기(현재는 한페이지에 3개씩만 나오도록 구성했음)
      sortOption: sortOption, // 등록순, 모집일자 마감순
    });

    try {
      // 승인 상태를 '수정'하는 것이므로, put request
      const response = await request(
        "PUT",
        `/posts/cancelApprove?${queryParams}`
      );

      setData(response.data.content); // 변경된 데이터를 갖고 새롭게 data를 세팅함
      setIsModalVisible(false); // 모달은 안보이게 설정
      setCancelModalVisible(false);
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const categoryTagStyle = {
    display: "flex",
    padding: "0px 5px 0px 5px",
    borderRadius: "50px" /* 타원형 모양을 만들기 위해 사용 */,
    color: "#677779" /* 텍스트 색상 설정 */,
    marginLeft: "-0.3%",
    marginRight: "5px",
  };

  //마우스를 게시글 위에 올렸을 때 텍스트에 밑줄 생기는 기능을 위한 css
  const linkStyle = {
    textDecoration: "none",
    transition: "text-decoration 0.3s",
    color: "black",
  };

  //마우스를 게시글 위에 올렸을 때 텍스트에 밑줄 생기는 기능을 위한 css
  const handleMouseEnter = (e) => {
    e.currentTarget.style.textDecoration = "underline";
  };

  //마우스를 게시글 위에 올렸을 때 텍스트에 밑줄 생기는 기능을 위한 css
  const handleMouseLeave = (e) => {
    e.currentTarget.style.textDecoration = "none";
  };

  const renderPosts = (posts) => {
    return (
      <div
        gutter={[16, 16]}
        style={{
          marginTop: "10px",
          padding: "1px",
          width: "100%",
          cursor: "pointer",
        }}
        justify="space-between"
      >
        <Card title={`GROUPS`} headStyle={{ background: "#DDEEFF" }}>
          {posts.map((item, index) => (
            <div>
              <div style={{ display: "flex", marginTop: "0px" }}>
                <div
                  style={{ width: "80%", display: "grid", marginLeft: "10px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <div>
                      {/* 프사 누르면 해당 유저 포트폴리오로 이동 */}
                      <Link
                        to={
                          myNickName === item.nickName
                            ? `/portfolio`
                            : `/portfolio/${item.nickName}`
                        }
                        key={index}
                        className="hoverable-item"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={linkStyle}
                      >
                        {/* 포트폴리오 사진 */}
                        <img
                          style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            border: "3px solid salmon",
                            marginRight: "10px",
                          }}
                          src={`https://storage.googleapis.com/hongik-pickme-bucket/${item.imageUrl}`}
                        />
                      </Link>
                    </div>
                    <div>
                      {/* 닉네임 누르면 포트폴리오로 이동 */}
                      <Link
                        to={
                          myNickName === item.nickName
                            ? `/portfolio`
                            : `/portfolio/${item.nickName}`
                        }
                        key={index}
                        className="hoverable-item"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={linkStyle}
                      >
                        {/* 닉네임 */}
                        <strong className="nickname">{item.nickName}</strong>
                      </Link>
                    </div>
                  </div>

                  <div style={{ display: "flex" }}>
                    {/* 게시물 제목 누르면 게시글로 이동 */}
                    <Link
                      to={
                        item.postType === "PROJECT"
                          ? `/project/detail/${item.id}`
                          : `/study/detail/${item.id}`
                      }
                      key={index}
                      className="hoverable-item"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={linkStyle}
                    >
                      {/* 게시물 제목 */}
                      <strong style={{ fontSize: "18px" }}>
                        {truncateString(item.title, 40)}
                      </strong>
                    </Link>
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      marginRight: "20px",
                      textAlign: "left",
                    }}
                    onMouseUp={() => handleRowClick(item.id, item.postType)}
                  >
                    {/* 한 줄 소개 눌러도 게시글로 이동, <Link>안 쓰고 <div>의 이벤트 함수를 썼기 때문에 밑줄기능 없음 */}
                    {truncateString(item.briefContent, 50)}
                  </div>
                  <strong
                    style={{
                      display: "flex",
                      marginTop: "10px",
                      fontSize: "12px",
                    }}
                  >
                    {item.web && (
                      <span
                        style={{
                          ...categoryTagStyle,
                          backgroundColor: "#91e2c3",
                        }}
                      >
                        #WEB
                      </span>
                    )}
                    {item.app && (
                      <span
                        style={{
                          ...categoryTagStyle,
                          backgroundColor: "#91e2c3",
                        }}
                      >
                        #APP
                      </span>
                    )}
                    {item.game && (
                      <span
                        style={{
                          ...categoryTagStyle,
                          backgroundColor: "#91e2c3",
                        }}
                      >
                        #GAME
                      </span>
                    )}
                    {item.ai && (
                      <span
                        style={{
                          ...categoryTagStyle,
                          backgroundColor: "#91e2c3",
                        }}
                      >
                        #AI
                      </span>
                    )}
                  </strong>
                </div>
                <div
                  style={{
                    display: "grid",
                    marginLeft: "0px",
                    width: "200px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    인원: {item.counts} / {item.recruitmentCount} <br></br>마감:{" "}
                    {formatDate(item.endDate)} <br></br> 조회 수:{" "}
                    {item.viewCount}
                    <br />
                    <br />
                    <div style={{ color: "gray", fontSize: "small" }}>
                      {formatDateTime(item.finalUpdatedTime)}
                    </div>
                  </div>
                </div>
              </div>
              <Divider />
            </div>
          ))}
        </Card>
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Row>
          {/** 버튼들을 중앙과 오른쪽 두 경우에만 위치시키기 위해 만든 좌측의 더미 공간 */}
          <Col span={12} style={{ textAlign: "left" }}>
            {/* Sort buttons - 등록순, 마감일자 순 버튼*/}
            <Button
              type={sortOption === "latestPosts" ? "primary" : "default"}
              onClick={() => handleSortOptionChange("latestPosts")}
              style={{ marginRight: "10px" }}
            >
              {postsOption === "writer" ? "등록순" : "최신 등록순"}
            </Button>

            <Button
              type={sortOption === "nearDeadline" ? "primary" : "default"}
              onClick={() => handleSortOptionChange("nearDeadline")}
            >
              가까운 마감일순
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {/** Sort buttons - 등록순, 마감일자 순 버튼 */}
            <Button
              type={postsOption === "writer" ? "primary" : "default"}
              onClick={() => handlePostsOptionChange("writer")}
              style={{ marginRight: "10px" }}
            >
              내가 작성한 게시물
            </Button>
            <Button
              type={postsOption === "applicant" ? "primary" : "default"}
              onClick={() => handlePostsOptionChange("applicant")}
            >
              내가 지원한 게시물
            </Button>
          </Col>
        </Row>
      </div>

      {renderPosts(data)}

      {/* antd페이지네이션 적용 */}
      {/* 동적으로 쿼리 날렸을 때 페이지 하단에 보이는 페이지 버튼도 동적으로 구성해야 함 -> 백엔드에서 받아온 totalPages를 기반으로 페이지 버튼 수를 만들어 넣어줌 */}
      {/*백엔드에서는 페이징을 0부터 시작하지만, 프론트에서는 페이지 버튼을 1부터 세팅해줘야하므로 이를 위한 코드*/}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Pagination
          current={currentPage + 1} // Ant Design's Pagination starts from 1, while your state starts from 0
          total={totalPages * pageSize} // 내용물의 총 개수 = 페이지 수 * 페이지 당 몇 개씩
          pageSize={pageSize} // 한 페이지에 몇 개씩 보여줄 것인가?
          onChange={(page) => setCurrentPage(page - 1)} //사용자가 해당 버튼 (예: 2번 버튼)을 누르면 currentPage를 1로 세팅하여 백엔드에 요청 보냄(백엔드는 프런트에서 보는 페이지보다 하나 적은 수부터 페이징을 시작하므로)
          showSizeChanger={false}
        />
      </div>
      <Modal
        title="유저 승인"
        open={isModalVisible}
        onOk={() => handleApproveUser(nickName, postsId)}
        onCancel={() => setIsModalVisible(false)}
        okText="예"
        cancelText="아니오"
      >
        <p>{nickName} 님을 승인하시겠습니까?</p>
      </Modal>
      <Modal
        title="유저 승인 취소"
        open={cancelModalVisible} // visible로 모달 열림 여부 설정
        onOk={() => handleCancelApproval(nickName, postsId)} // 취소 버튼을 누르면 모달 닫기
        onCancel={() => setCancelModalVisible(false)} // "예" 버튼을 누르면 승인 취소 동작 처리 함수 호출
        okText="예"
        cancelText="아니오"
      >
        <p>{nickName} 님을 승인 취소하시겠습니까?</p>
      </Modal>
    </div>
  );
}

export default GroupPage;
