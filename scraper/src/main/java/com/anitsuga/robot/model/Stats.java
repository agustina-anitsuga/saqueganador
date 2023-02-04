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

    private String summary;
    private String clay;
    private String hard;
    private String indoors;
    private String grass;
    private String notset;

}
