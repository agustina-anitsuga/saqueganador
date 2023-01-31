package com.anitsuga.robot.model;

/**
 * KeyGenerator
 */
public class KeyGenerator {

    public static String getPlayerKey(String league, String playerFullName ){
        return String.format("%s/players/%s",league, playerFullName.toLowerCase().replaceAll(" ","-"));
    }

    public static String getPlayerKey(String league, String firstName, String lastName ){
        return getPlayerKey( league, String.format("%s %s",firstName,lastName) );
    }

    public static String getRankingKey(String league) {
        return String.format("%s/players",league);
    }
}
