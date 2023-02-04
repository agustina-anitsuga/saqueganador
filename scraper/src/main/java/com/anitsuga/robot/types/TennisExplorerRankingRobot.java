package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Ranking;
import com.anitsuga.robot.page.TennisExplorerRankingPage;
import org.openqa.selenium.WebDriver;

/**
 * TennisExplorerRankingRobot
 * @author agustina.dagnino
 */
public class TennisExplorerRankingRobot extends AbstractRobot {

    private String league;

    /**
     * TennisExplorerRankingRobot
     * @param robotType
     * @param parameters
     */
    public TennisExplorerRankingRobot(RobotType robotType, Object... parameters) {
        super(robotType, null);
        this.league = (String) parameters[0];
    }

    /**
     * goToContentPage
     * @param url
     * @param driver
     * @return
     */
    @Override
    protected Page goToContentPage(String url, WebDriver driver) {
        TennisExplorerRankingPage page = new TennisExplorerRankingPage(driver);
        return page.go(url);
    }

    /**
     * scrapeContent
     * @param url
     * @param driver
     * @param contentPage
     * @return
     */
    @Override
    protected Content scrapeContent(String url, WebDriver driver, Page contentPage) {
        TennisExplorerRankingPage page = (TennisExplorerRankingPage) contentPage;
        Ranking ranking = Ranking.builder()
                .league(league)
                .players(page.getRankedPlayers(league))
                .build();
        ranking.setSource(url);
        return ranking;
    }

    /**
     * validConfig
     * @return
     */
    @Override
    public boolean validConfig() {
        return super.validConfig() &&
                !AppProperties.getInstance().isPropertyEmpty("wta.league") &&
                !AppProperties.getInstance().isPropertyEmpty("atp.league") &&
                !AppProperties.getInstance().isPropertyEmpty("tennisExplorer.atp.url") &&
                !AppProperties.getInstance().isPropertyEmpty("tennisExplorer.wta.url") ;
    }
}
