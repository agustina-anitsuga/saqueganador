package com.anitsuga.robot;

import java.util.List;

import com.anitsuga.fwk.utils.Browser;
import com.anitsuga.fwk.utils.SeleniumUtils;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.RankedPlayer;
import com.anitsuga.robot.model.Ranking;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static com.anitsuga.robot.AbstractRobot.runRobot;


/**
 * AllPlayersScraper
 * @author agustina.dagnino
 *
 */
public class AllPlayersScraper {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(AllPlayersScraper.class.getName());

    /**
     * main
     * @param args
     */
    public static void main(String[] args) {
        AllPlayersScraper self = new AllPlayersScraper();
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
     * scrapeATPPlayers
     * @param driver
     */
    private void scrapeATPPlayers(WebDriver driver) {
        // scrape atp ranking
        List<Content> atpRanking = runRobot(driver, RobotType.ATP_RANKING_SCRAPER, null);

        // scrape atp player data - cloudflare prevents scraping the players profiles from atp site
        // List<Content> players = this.runRobot(driver, RobotType.ATP_PLAYERS_SCRAPER, getRankedPlayerList(atpRanking));

        // scrape espn atp ranking
        List<Content> espnAtpRanking = runRobot(driver, RobotType.ESPN_ATP_RANKING_SCRAPER, null);

        // scrape espn atp players
        List<Content> espnAtpPlayers = runRobot(driver, RobotType.ESPN_ATP_PLAYERS_SCRAPER,
                getRankedPlayerList(espnAtpRanking),
                getRankedPlayerList(atpRanking));
    }

    /**
     * scrapeWTAPlayers
     * @param driver
     */
    private void scrapeWTAPlayers(WebDriver driver) {
        // scrape wta ranking
        List<Content> wtaRanking = runRobot(driver, RobotType.WTA_RANKING_SCRAPER, null);

        // scrape wta player data
        List<Content> wtaPlayers = runRobot(driver, RobotType.WTA_PLAYERS_SCRAPER,
                getRankedPlayerList(wtaRanking) );
    }

    /**
     * getRankedPlayerList
     * @param ranking
     * @return
     */
    private List<RankedPlayer> getRankedPlayerList(List<Content> ranking) {
        return ((Ranking) ranking.get(0)).getPlayers();
    }

}
