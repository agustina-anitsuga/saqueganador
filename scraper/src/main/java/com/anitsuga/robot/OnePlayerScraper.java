package com.anitsuga.robot;

import com.anitsuga.fwk.utils.Browser;
import com.anitsuga.fwk.utils.SeleniumUtils;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.RankedPlayer;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.List;

import static com.anitsuga.robot.AbstractRobot.runRobot;


/**
 * OnePlayerScraper
 * @author agustina.dagnino
 *
 */
public class OnePlayerScraper {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(OnePlayerScraper.class.getName());

    /**
     * main
     * @param args
     */
    public static void main(String[] args) {
        OnePlayerScraper self = new OnePlayerScraper();
        self.scrapeContent(RobotType.WTA_PLAYERS_SCRAPER,
                "wta",
                "https://www.wtatennis.com/players/330482/diana-shnaider",
                "Diana Shnaider");
        System.exit(0);
    }

    /**
     * scrapeContent
     */
    private void scrapeContent(RobotType type, String league, String url, String name) {
        WebDriver driver = SeleniumUtils.buildDriver(Browser.CHROME);

        RankedPlayer aRankedPlayer = new RankedPlayer();
        aRankedPlayer.setLeague(league);
        aRankedPlayer.setSource(url);
        aRankedPlayer.setName(name);
        List<RankedPlayer> list = Arrays.asList(aRankedPlayer);

        // scrape espn atp players
        List<Content> players = runRobot(driver, type, list);
    }

}
