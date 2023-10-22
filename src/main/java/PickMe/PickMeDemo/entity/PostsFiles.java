package PickMe.PickMeDemo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class PostsFiles extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "posts_files_id")
    private Long id; //게시물 파일 테이블의 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posts_id")
    private Posts posts;

    private boolean isImage; // 해당 파일이 이미지 파일인지 아닌지 구분하기 위한 구분자

    private String fileUrl; // 구글 드라이브에 저장되는 파일의 uuid값

}
