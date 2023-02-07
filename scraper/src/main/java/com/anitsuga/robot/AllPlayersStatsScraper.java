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
import java.util.List;

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
        this.scrapeWTAPlayers(driver);
        this.scrapeATPPlayers(driver);
    }

    /**
     * scrapeWTAPlayers
     * @param driver
     */
    private void scrapeWTAPlayers(WebDriver driver) {
        // scrape wta ranking
        List<Content> ranking = runRobot(driver, RobotType.WTA_TENNIS_EXPLORER_RANKING_SCRAPER, "wta");

        // scrape wta player data
        List<Content> payers = runRobot(driver, RobotType.WTA_TENNIS_EXPLORER_PLAYERS_SCRAPER,
                getRankedPlayerList(ranking),
                "wta");
    }

    /**
     * scrapeATPPlayers
     * @param driver
     */
    private void scrapeATPPlayers(WebDriver driver) {
        // scrape atp ranking
        List<Content> ranking = runRobot(driver, RobotType.ATP_TENNIS_EXPLORER_RANKING_SCRAPER, "atp");

        // scrape atp player data
        List<Content> players = runRobot(driver, RobotType.ATP_TENNIS_EXPLORER_PLAYERS_SCRAPER,
                getRankedPlayerList(ranking),
                "atp");
    }

    /**
     * getRankedPlayerList
     * @param ranking
     * @return
     */
    private List<RankedPlayer> getRankedPlayerList(List<Content> ranking) {
        List<RankedPlayer> ret = new ArrayList<>();
        for (Content r: ranking) {
            ret.addAll(((Ranking)r).getPlayers());
        }
        return ret;
    }

}
