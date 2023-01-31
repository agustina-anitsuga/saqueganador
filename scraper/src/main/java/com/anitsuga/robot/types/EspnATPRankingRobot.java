package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Ranking;
import com.anitsuga.robot.page.ATPRankingPage;
import com.anitsuga.robot.page.EspnATPRankingPage;
import org.openqa.selenium.WebDriver;

/**
 * EspnATPRankingRobot
 * @author agustina.dagnino
 */
public class EspnATPRankingRobot extends AbstractRobot {

    /**
     * EspnATPRankingRobot
     * @param robotType
     * @param parameters
     */
    public EspnATPRankingRobot(RobotType robotType, Object... parameters) {
        super(robotType, parameters);
    }

    /**
     * goToContentPage
     * @param url
     * @param driver
     * @return
     */
    @Override
    protected Page goToContentPage(String url, WebDriver driver) {
        EspnATPRankingPage page = new EspnATPRankingPage(driver);
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
        EspnATPRankingPage page = (EspnATPRankingPage) contentPage;
        String league = AppProperties.getInstance().getProperty("atp.league");
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
                !AppProperties.getInstance().isPropertyEmpty("espn.url") &&
                !AppProperties.getInstance().isPropertyEmpty("atp.league") ;
    }
}
