package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Ranking;
import com.anitsuga.robot.page.ATPRankingPage;
import org.openqa.selenium.WebDriver;

/**
 * ATPRankingRobot
 * @author agustina.dagnino
 */
public class ATPRankingRobot extends AbstractRobot {

    /**
     * ATPRankingRobot
     * @param robotType
     * @param parameters
     */
    public ATPRankingRobot(RobotType robotType, Object... parameters) {
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
        ATPRankingPage page = new ATPRankingPage(driver);
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
        ATPRankingPage page = (ATPRankingPage) contentPage;
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
                !AppProperties.getInstance().isPropertyEmpty("atp.url") &&
                !AppProperties.getInstance().isPropertyEmpty("atp.league") ;
    }
}
