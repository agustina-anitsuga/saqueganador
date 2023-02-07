package com.anitsuga.robot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stats extends Content {

    private Integer year;
    private String currentSinglesRanking;
    private String highestSinglesRanking;
    private String currentDoublesRanking;
    private String highestDoublesRanking;
    private String summary;
    private String clay;
    private String hard;
    private String indoors;
    private String grass;
    private String notset;

}
