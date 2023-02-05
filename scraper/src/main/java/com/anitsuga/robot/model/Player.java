package com.anitsuga.robot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import static com.anitsuga.fwk.utils.StringUtils.isEmpty;

/**
 * Player
 * @author agustina.dagnino
 *
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player extends Content {

    private String league;

    private String firstName;
    private String lastName;
    private String fullName;

    private Date birthDate;
    private String birthPlace;
    private String nationality;
    private Integer yearTurnedPro;

    private Integer weightInKilos;
    private Integer heightInCm;

    private String gameStyle;
    private String coach;

    private String profilePicUrl;

    private String biography;

    private String leagueProfileUrl;

    private Stats stats;

    public String getKey(){
        String key = null;
        if( !isEmpty(this.getFirstName()) && !isEmpty(this.getLastName())) {
            key = KeyGenerator.getPlayerKey(this.getLeague(), this.getFirstName(), this.getLastName());
        } else {
            key = KeyGenerator.getPlayerKey(this.getLeague(), this.getFullName());
        }
        return key;
    }

}
