package PickMe.PickMeDemo.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserRecommendationDto {

    private Long userId;
    private String nickName;
    private String userEmail;
    private int[] fieldsOfInterests = new int[4];
    private String briefIntro;
}
