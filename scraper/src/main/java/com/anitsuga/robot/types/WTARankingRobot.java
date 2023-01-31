package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.RankedPlayer;
import com.anitsuga.robot.model.Ranking;
import com.anitsuga.robot.page.ATPRankingPage;
import com.anitsuga.robot.page.WTARankingPage;
import org.openqa.selenium.WebDriver;

/**
 * WTARankingRobot
 * @author agustina.dagnino
 */
public class WTARankingRobot extends AbstractRobot {

    /**
     * WTARankingRobot
     * @param robotType
     * @param parameters
     */
    public WTARankingRobot(RobotType robotType, Object... parameters) {
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
        WTARankingPage page = new WTARankingPage(driver);
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
        WTARankingPage page = (WTARankingPage) contentPage;
        String league = AppProperties.getInstance().getProperty("wta.league");
        page.forceLoadOnScroll();
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
                !AppProperties.getInstance().isPropertyEmpty("wta.url") &&
                !AppProperties.getInstance().isPropertyEmpty("wta.league") ;
    }
}
