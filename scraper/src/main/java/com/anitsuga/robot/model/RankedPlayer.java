package com.anitsuga.robot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Ranking
 * @author agustina.dagnino
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankedPlayer extends Content {

    private String league;
    private String name;

    public String getKey(){
        return KeyGenerator.getPlayerKey(this.getLeague(),this.getName());
    }
}
