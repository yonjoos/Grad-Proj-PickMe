package PickMe.PickMeDemo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Arrays;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@Table(name = "similarity")
public class VectorSimilarity {

    @Id @GeneratedValue
    private Long id;

    private int[] vectorA;
    private int[] vectorB;

    private double similarity;


    public VectorSimilarity(int[] VectorA, int[] VectorB){
        this.vectorA = VectorA;
        this.vectorB = VectorB;
    }

}
