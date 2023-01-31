package com.anitsuga.robot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Ranking
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ranking extends Content {

    private List<RankedPlayer> players;
    private String league;

    public String getKey(){
        return KeyGenerator.getRankingKey(league);
    }
}
