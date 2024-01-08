package com.anitsuga.robot;

import com.anitsuga.fwk.utils.Browser;
import com.anitsuga.fwk.utils.SeleniumUtils;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.RankedPlayer;
import com.anitsuga.robot.model.Ranking;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.anitsuga.robot.AbstractRobot.runRobot;


/**
 * AllPlayersStatsScraper
 * @author agustina.dagnino
 *
 */
public class AllPlayersStatsScraper {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AllPlayersStatsScraper.class.getName());

    /**
     * main
     * @param args
     */
    public static void main(String[] args) {
        AllPlayersStatsScraper self = new AllPlayersStatsScraper();
        self.scrapeContent();
        System.exit(0);
    }

    /**
     * scrapeContent
     */
    private void scrapeContent() {
        WebDriver driver = SeleniumUtils.buildDriver(Browser.CHROME);

        List<Integer> years = IntStream.range(2023, 2024).boxed().collect(Collectors.toList());
        Collections.reverse(years);

        for (Integer year : years) {
            //this.scrapeWTAPlayers(driver, year);
            this.scrapeATPPlayers(driver, year);
        }
    }

    /**
     * scrapeWTAPlayers
     * @param driver
     */
    private void scrapeWTAPlayers(WebDriver driver, Integer year) {

        // scrape wta ranking
        List<Content> ranking = runRobot(driver, RobotType.WTA_TENNIS_EXPLORER_RANKING_SCRAPER, "wta", year );

        // scrape wta player data
        List<Content> payers = runRobot(driver, RobotType.WTA_TENNIS_EXPLORER_PLAYERS_SCRAPER,
                getRankedPlayerList(ranking),
                "wta",
                year);
    }

    /**
     * scrapeATPPlayers
     * @param driver
     */
    private void scrapeATPPlayers(WebDriver driver, Integer year) {
        // scrape atp ranking
        List<Content> ranking = runRobot(driver, RobotType.ATP_TENNIS_EXPLORER_RANKING_SCRAPER, "atp", year);

        // scrape atp player data
        List<Content> players = runRobot(driver, RobotType.ATP_TENNIS_EXPLORER_PLAYERS_SCRAPER,
                getRankedPlayerList(ranking),
                "atp",
                year);
    }

    /**
     * getRankedPlayerList
     * @param ranking
     * @return
     */
    private List<RankedPlayer> getRankedPlayerList(List<Content> ranking) {
        List<RankedPlayer> ret = new ArrayList<>();
        for (Content r: ranking) {
            if( r!=null ){
                ret.addAll(((Ranking) r).getPlayers());
            }
        }
        /*
        for ( int i=0; i<1246; i++ ) {
            ret.remove(0);
        }
        */
        return ret;
    }

}
