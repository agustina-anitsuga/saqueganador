package com.anitsuga.robot.types;

import com.anitsuga.robot.RobotURLProvider;
import com.anitsuga.robot.model.RankedPlayer;
import org.openqa.selenium.WebDriver;

import java.util.List;
import java.util.stream.Collectors;

/**
 * RankedPlayerURLProvider
 * @author agustina.dagnino
 */
public class RankedPlayerURLProvider implements RobotURLProvider {

    private List<RankedPlayer> players ;

    /**
     * RankedPlayerURLProvider
     * @param url
     */
    public RankedPlayerURLProvider(String url ){
    }

    /**
     * getURLs
     * @return
     */
    @Override
    public List<String> getURLs() {
        return players.stream()
                .map( (RankedPlayer player) -> player.getSource() )
                .collect(Collectors.toList());
    }

    /**
     * setParameters
     * @param parameters
     */
    @Override
    public void setParameters(Object parameters) {
        this.players = (List<RankedPlayer>) parameters;
    }
}
