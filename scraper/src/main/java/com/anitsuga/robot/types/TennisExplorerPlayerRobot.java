package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import com.anitsuga.robot.model.Stats;
import com.anitsuga.robot.page.TennisExplorerPlayerPage;
import org.openqa.selenium.WebDriver;

/**
 * TennisExplorerPlayerRobot
 * @author agustina.dagnino
 */
public class TennisExplorerPlayerRobot extends AbstractRobot {

    private String league;
    private Integer year;

    /**
     * TennisExplorerPlayerRobot
     * @param robotType
     * @param parameters
     */
    public TennisExplorerPlayerRobot(RobotType robotType, Object... parameters) {
        super(robotType, parameters);
        this.league = (String) parameters[1];
        this.year = (Integer) parameters[2];
    }

    /**
     * goToContentPage
     * @param url
     * @param driver
     * @return
     */
    @Override
    protected Page goToContentPage(String url, WebDriver driver) {
        TennisExplorerPlayerPage page = new TennisExplorerPlayerPage(driver);
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
        TennisExplorerPlayerPage page = (TennisExplorerPlayerPage) contentPage;

        Stats stats = Stats.builder()
                .currentSinglesRanking(page.getCurrentSinglesRanking())
                .highestSinglesRanking(page.getHighestSinglesRanking())
                .currentDoublesRanking(page.getCurrentDoublesRanking())
                .highestDoublesRanking(page.getHighestDoublesRanking())
                .year(this.year)
                .summary(page.getSummary())
                .clay(page.getClay())
                .hard(page.getHard())
                .indoors(page.getIndoors())
                .grass(page.getGrass())
                .notset(page.getNotSet())
                .build();
        Player player = Player.builder()
                .fullName(page.getFullName())
                .nationality(page.getCountry())
                .birthDate(page.getBirthDate())
                .gameStyle(page.getGameStyle())
                .league(league)
                .stats(stats)
                .build();
        player.setSource(url);
        return player;
    }

    /**
     * validConfig
     * @return
     */
    public boolean validConfig() {
        return super.validConfig() &&
                !AppProperties.getInstance().isPropertyEmpty("atp.league") &&
                !AppProperties.getInstance().isPropertyEmpty("wta.league") &&
                this.parameters != null;
    }
}
