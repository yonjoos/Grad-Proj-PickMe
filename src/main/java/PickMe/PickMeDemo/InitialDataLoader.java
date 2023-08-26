package PickMe.PickMeDemo;

import PickMe.PickMeDemo.entity.*;
import PickMe.PickMeDemo.repository.CategoryRepository;
import PickMe.PickMeDemo.repository.PortfolioRepository;
import PickMe.PickMeDemo.repository.PostsRepository;
import PickMe.PickMeDemo.repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.CharBuffer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
@AllArgsConstructor
public class InitialDataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PortfolioRepository portfolioRepository;
    private final PostsRepository postsRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        // 초기 데이터 생성 및 저장(관리자)
        User adminUser = User.builder()
                .userName("admin")
                .nickName("admin")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("admin"))  // 비밀번호 해싱
                .role(Role.ADMIN)
                .build();

        userRepository.save(adminUser);


        // 초기 데이터 생성 및 저장(유저)
        User generalUser = User.builder()
                        .userName("user")
                        .nickName("user")
                        .email("user@gmail.com")
                        .password(passwordEncoder.encode("user"))  // 비밀번호 해싱
                        .role(Role.USER)
                        .build();

        userRepository.save(generalUser);

        // 포트폴리오 생성자
        // public Portfolio(User user, Integer web, Integer app, Integer game, Integer ai, String shortIntroduce, String introduce, String fileUrl)
        Portfolio generalPortfolio = Portfolio.builder()
                .user(generalUser)
                .web(4)
                .app(3)
                .game(2)
                .ai(1)
                .shortIntroduce("안녕하세요, 웹과 앱에 관심있는 코딩 꿈나무입니다.")
                .introduce("- 맛있홍 프로젝트 (React + Node.js + Express.js)" +
                        "- 픽미 프로젝트 (React + SpringBoot + JPA)")
                .fileUrl("")
                .build();


        portfolioRepository.save(generalPortfolio);



        // 초기 데이터 생성 및 저장(1)
        // 모든 값이 비어있어서 생성 실험 가능한 유저
        User user1 = User.builder()
                .userName("Test")
                .nickName("Test")
                .email("1")
                .password(passwordEncoder.encode("1"))  // 비밀번호 해싱
                .role(Role.USER)
                .build();

        userRepository.save(user1);


        // 초기 데이터 생성 및 저장(2)
        User user2 = User.builder()
                .userName("이윤식")
                .nickName("rilato")
                .email("2")
                .password(passwordEncoder.encode("2"))  // 비밀번호 해싱
                .role(Role.USER)
                .build();

        userRepository.save(user2);

        Portfolio user2Portfolio = Portfolio.builder()
                .user(user2)
                .web(4)
                .app(0)
                .game(3)
                .ai(0)
                .shortIntroduce("안녕하세요, 웹과 앱에 관심있는 코딩 꿈나무입니다.")
                .introduce("- 맛있홍 프로젝트 (React + Node.js + Express.js) / - 픽미 프로젝트 (React + SpringBoot + JPA) / - 코로나 보드 크롤링 프로젝트(Node.js + Express.js)")
                .fileUrl("")
                .build();
        
        portfolioRepository.save(user2Portfolio);

        String initialEndDate1 = "2023-09-30"; // 원하는 종료 날짜를 스트링으로 받음
        DateTimeFormatter dateFormatter1 = DateTimeFormatter.ofPattern("yyyy-MM-dd");   // 날짜 포맷터를 사용하여 날짜 문자열을 'LocalDate' 개체로 변환
        LocalDate endDate1 = LocalDate.parse(initialEndDate1, dateFormatter1);

        // Posts 생성자 : (User user, PostType postType, String title, Integer recruitmentCount, String content, String promoteImageUrl, String fileUrl, LocalDate endDate)
        Posts posts1 = Posts.builder()
                .user(user2)
                .postType(PostType.PROJECT)
                .title("졸프 팀원 구해요~")
                .recruitmentCount(3)
                .content("졸업 프로젝트 팀원을 모집합니다. 현재 저는 풀스택 개발 가능하고, Spring Boot 가능한 백엔드 개발자 한 분과, React 및 Redux 사용 가능한 프론트 개발자 두 분을 모십니다.")
                .promoteImageUrl(null)
                .fileUrl(null)
                .endDate(endDate1)
                .build();

        postsRepository.save(posts1);

        Category category1 = Category.builder()
                .posts(posts1)
                .web(true)
                .app(false)
                .game(false)
                .ai(true)
                .build();

        categoryRepository.save(category1);

        String initialEndDate2 = "2023-10-10";
        DateTimeFormatter dateFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate2 = LocalDate.parse(initialEndDate2, dateFormatter2);

        Posts posts2 = Posts.builder()
                .user(user2)
                .postType(PostType.PROJECT)
                .title("토이 플젝 하실분?")
                .recruitmentCount(1)
                .content("토이 프로젝트 팀원을 모집합니다. 주제는 아직 정해지지 않았습니다. 현재 저는 백엔드 개발 가능하고, React 및 Redux 사용 가능한 프론트 개발자 두 분을 모십니다.")
                .promoteImageUrl("사진 없음")
                .fileUrl("파일 없음")
                .endDate(endDate2)
                .build();

        postsRepository.save(posts2);

        Category category2 = Category.builder()
                .posts(posts2)
                .web(true)
                .app(true)
                .game(false)
                .ai(true)
                .build();

        categoryRepository.save(category2);

        String initialEndDate3 = "2023-09-16";
        DateTimeFormatter dateFormatter3 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate3 = LocalDate.parse(initialEndDate3, dateFormatter3);

        Posts posts3 = Posts.builder()
                .user(user2)
                .postType(PostType.STUDY)
                .title("배자구 스터디")
                .recruitmentCount(3)
                .content("배자구 스터디 구합니다. 감자도 환영합니다. 저도 자구알못이에요..ㅠㅠ")
                .promoteImageUrl("사진")
                .fileUrl("파일")
                .endDate(endDate3)
                .build();

        postsRepository.save(posts3);

        Category category3 = Category.builder()
                .posts(posts3)
                .web(false)
                .app(false)
                .game(false)
                .ai(false)
                .build();

        categoryRepository.save(category3);

        // 초기 데이터 생성 및 저장(3)
        User user3 = User.builder()
                .userName("박시홍")
                .nickName("freshhongsi")
                .email("3")
                .password(passwordEncoder.encode("3"))  // 비밀번호 해싱
                .role(Role.USER)
                .build();

        userRepository.save(user3);

        Portfolio user3Portfolio = Portfolio.builder()
                .user(user3)
                .web(4)
                .app(3)
                .game(0)
                .ai(0)
                .shortIntroduce("풀스택 개발자 그 자체, 홍시입니다.")
                .introduce("- 맛있홍 프로젝트 (React + Node.js + Express.js) / - 픽미 프로젝트 (React + SpringBoot + JPA) / - 코로나 보드 크롤링 프로젝트(Node.js + Express.js)")
                .fileUrl("")
                .build();

        portfolioRepository.save(user3Portfolio);

        String initialEndDate4 = "2023-09-12"; // 원하는 종료 날짜를 스트링으로 받음
        DateTimeFormatter dateFormatter4 = DateTimeFormatter.ofPattern("yyyy-MM-dd");   // 날짜 포맷터를 사용하여 날짜 문자열을 'LocalDate' 개체로 변환
        LocalDate endDate4 = LocalDate.parse(initialEndDate4, dateFormatter4);

        // Posts 생성자 : (User user, PostType postType, String title, Integer recruitmentCount, String content, String promoteImageUrl, String fileUrl, LocalDate endDate)
        Posts posts4 = Posts.builder()
                .user(user3)
                .postType(PostType.PROJECT)
                .title("권교수님과 졸프 하실분!")
                .recruitmentCount(2)
                .content("권건우 교수님과 함께할 졸업 프로젝트 팀원을 모집합니다. 주제는 먹거리 관련 입니다. 현재 저는 풀스택 개발 가능하고, Spring Boot 가능한 백엔드 개발자 한 분과, React 및 Redux 사용 가능한 프론트 개발자 한 분을 모십니다.")
                .promoteImageUrl(null)
                .fileUrl(null)
                .endDate(endDate4)
                .build();

        postsRepository.save(posts4);

        Category category4 = Category.builder()
                .posts(posts4)
                .web(true)
                .app(false)
                .game(false)
                .ai(true)
                .build();

        categoryRepository.save(category4);

        String initialEndDate5 = "2023-09-23";
        DateTimeFormatter dateFormatter5 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate5 = LocalDate.parse(initialEndDate5, dateFormatter5);

        Posts posts5 = Posts.builder()
                .user(user3)
                .postType(PostType.STUDY)
                .title("알골 스터디 팀원 구함")
                .recruitmentCount(4)
                .content("알고리즘 스터디 구함. 란골 배골 곤골 모두 환영. 백준 플래티넘이 목표.")
                .promoteImageUrl("사진 없음")
                .fileUrl("파일 없음")
                .endDate(endDate5)
                .build();

        postsRepository.save(posts5);

        Category category5 = Category.builder()
                .posts(posts5)
                .web(false)
                .app(false)
                .game(false)
                .ai(false)
                .build();

        categoryRepository.save(category5);


        String initialEndDate6 = "2023-09-20";
        DateTimeFormatter dateFormatter6 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate6 = LocalDate.parse(initialEndDate6, dateFormatter6);

        Posts posts6 = Posts.builder()
                .user(user3)
                .postType(PostType.STUDY)
                .title("프린스 송")
                .recruitmentCount(3)
                .content("송프언 프롤로그, 렉스, 야크, 리스프 과제 같이 고민해요")
                .promoteImageUrl("사진")
                .fileUrl("파일")
                .endDate(endDate6)
                .build();

        postsRepository.save(posts6);

        Category category6 = Category.builder()
                .posts(posts6)
                .web(false)
                .app(false)
                .game(false)
                .ai(false)
                .build();

        categoryRepository.save(category6);

        // 초기 데이터 생성 및 저장(4)
        User user4 = User.builder()
                .userName("정연주")
                .nickName("yonjoos")
                .email("4")
                .password(passwordEncoder.encode("4"))  // 비밀번호 해싱
                .role(Role.USER)
                .build();

        userRepository.save(user4);

        Portfolio user4Portfolio = Portfolio.builder()
                .user(user4)
                .web(4)
                .app(0)
                .game(0)
                .ai(3)
                .shortIntroduce("시각디자인과에서의 경험을 바탕으로 미적 감각이 뛰어납니다. 하지만 백엔드를 희망합니다.")
                .introduce("- 맛있홍 프로젝트 (React + Node.js + Express.js / 픽미 프로젝트 (React + SpringBoot + JPA) / 졸업 프로젝트 (Unity)")
                .fileUrl("")
                .build();

        portfolioRepository.save(user4Portfolio);

        String initialEndDate7 = "2023-09-15"; // 원하는 종료 날짜를 스트링으로 받음
        DateTimeFormatter dateFormatter7 = DateTimeFormatter.ofPattern("yyyy-MM-dd");   // 날짜 포맷터를 사용하여 날짜 문자열을 'LocalDate' 개체로 변환
        LocalDate endDate7 = LocalDate.parse(initialEndDate7, dateFormatter7);

        // Posts 생성자 : (User user, PostType postType, String title, Integer recruitmentCount, String content, String promoteImageUrl, String fileUrl, LocalDate endDate)
        Posts posts7 = Posts.builder()
                .user(user4)
                .postType(PostType.PROJECT)
                .title("유니티 활용한 졸프")
                .recruitmentCount(2)
                .content("유니티 잘 쓸 줄 아시는 분 두 분 구해봐용..")
                .promoteImageUrl("사진 뭐하지")
                .fileUrl("나도 몰라")
                .endDate(endDate7)
                .build();

        postsRepository.save(posts7);

        Category category7 = Category.builder()
                .posts(posts7)
                .web(false)
                .app(false)
                .game(true)
                .ai(true)
                .build();

        categoryRepository.save(category7);

        String initialEndDate8 = "2023-09-28";
        DateTimeFormatter dateFormatter8 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate8 = LocalDate.parse(initialEndDate8, dateFormatter8);

        Posts posts8 = Posts.builder()
                .user(user4)
                .postType(PostType.STUDY)
                .title("알골 스터디 하실 분~")
                .recruitmentCount(3)
                .content("알고리즘 스터디 구해여. 매일 백준 한 문제씩 푸는 것이 목표에용.")
                .promoteImageUrl("사진 없음")
                .fileUrl("파일 없음")
                .endDate(endDate7)
                .build();

        postsRepository.save(posts8);

        Category category8 = Category.builder()
                .posts(posts8)
                .web(false)
                .app(false)
                .game(false)
                .ai(false)
                .build();

        categoryRepository.save(category8);


        String initialEndDate9 = "2023-09-20";
        DateTimeFormatter dateFormatter9 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate9 = LocalDate.parse(initialEndDate9, dateFormatter9);

        Posts posts9 = Posts.builder()
                .user(user4)
                .postType(PostType.STUDY)
                .title("송하윤 교수님의 길찾기 놀이")
                .recruitmentCount(3)
                .content("두 길이 주어지면, 가운데 길을 예측해서 이어 보아요.. 지리에 관심있는 분 환영. AI 관심있는 분 대 환영")
                .promoteImageUrl("사진")
                .fileUrl("파일")
                .endDate(endDate6)
                .build();

        postsRepository.save(posts9);

        Category category9 = Category.builder()
                .posts(posts9)
                .web(true)
                .app(true)
                .game(true)
                .ai(true)
                .build();

        categoryRepository.save(category9);

        // 초기 데이터 생성 및 저장(5)
        User user5 = User.builder()
                .userName("홍길동")
                .nickName("고길동")
                .email("5")
                .password(passwordEncoder.encode("5"))  // 비밀번호 해싱
                .role(Role.USER)
                .build();

        userRepository.save(user5);

        Portfolio user5Portfolio = Portfolio.builder()
                .user(user5)
                .web(0)
                .app(0)
                .game(4)
                .ai(3)
                .shortIntroduce("아버지를 아버지라 부르지 못하고..")
                .introduce("- 둘리 프로젝트 (주연) / 최초의 한글소설 프로젝트 (주연)")
                .fileUrl("")
                .build();

        portfolioRepository.save(user5Portfolio);

        String initialEndDate10 = "2023-09-20";
        DateTimeFormatter dateFormatter10 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate10 = LocalDate.parse(initialEndDate10, dateFormatter10);

        // Posts 생성자 : (User user, PostType postType, String title, Integer recruitmentCount, String content, String promoteImageUrl, String fileUrl, LocalDate endDate)
        Posts posts10 = Posts.builder()
                .user(user5)
                .postType(PostType.PROJECT)
                .title("게임이나 만들자.")
                .recruitmentCount(2)
                .content("유니티, 언리얼 사용할 줄 아는 사람 환영. C# 잘 쓰고 C++ 잘하는 사람도 환영.")
                .promoteImageUrl(null)
                .fileUrl(null)
                .endDate(endDate10)
                .build();

        postsRepository.save(posts10);

        Category category10 = Category.builder()
                .posts(posts10)
                .web(false)
                .app(false)
                .game(true)
                .ai(false)
                .build();

        categoryRepository.save(category10);

        String initialEndDate11 = "2023-10-01";
        DateTimeFormatter dateFormatter11 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate11 = LocalDate.parse(initialEndDate11, dateFormatter11);

        Posts posts11 = Posts.builder()
                .user(user5)
                .postType(PostType.PROJECT)
                .title("인공지능 마스터")
                .recruitmentCount(2)
                .content("인공지능 잘 활용하시는 분과 함께 프로젝트 하고 싶어요.")
                .promoteImageUrl(null)
                .fileUrl(null)
                .endDate(endDate11)
                .build();

        postsRepository.save(posts11);

        Category category11 = Category.builder()
                .posts(posts11)
                .web(false)
                .app(false)
                .game(false)
                .ai(true)
                .build();

        categoryRepository.save(category11);


        String initialEndDate12 = "2023-10-05";
        DateTimeFormatter dateFormatter12 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate endDate12 = LocalDate.parse(initialEndDate12, dateFormatter12);

        Posts posts12 = Posts.builder()
                .user(user5)
                .postType(PostType.STUDY)
                .title("유니티랑 C# 같이 공부하실 분 구합니다.")
                .recruitmentCount(5)
                .content("같이 열심히 공부해서, 플젝도 만들어봐요!!")
                .promoteImageUrl("사진")
                .fileUrl("파일")
                .endDate(endDate12)
                .build();

        postsRepository.save(posts12);

        Category category12 = Category.builder()
                .posts(posts12)
                .web(false)
                .app(false)
                .game(true)
                .ai(true)
                .build();

        categoryRepository.save(category12);
    }
}