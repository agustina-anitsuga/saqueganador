package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import com.anitsuga.robot.model.RankedPlayer;
import com.anitsuga.robot.model.Ranking;
import com.anitsuga.robot.page.ATPPlayerPage;
import com.anitsuga.robot.page.ATPRankingPage;
import org.openqa.selenium.WebDriver;

/**
 * ATPPlayerRobot
 * @author agustina.dagnino
 */
public class ATPPlayerRobot extends AbstractRobot {

    /**
     * ATPPlayerRobot
     * @param robotType
     * @param parameters
     */
    public ATPPlayerRobot(RobotType robotType, Object... parameters) {
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
        ATPPlayerPage page = new ATPPlayerPage(driver);
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
        ATPPlayerPage page = (ATPPlayerPage) contentPage;
        Player player = Player.builder()
                .firstName(page.getFirstName())
                .lastName(page.getLastName())
                .birthPlace(page.getBirthPlace())
                .gameStyle(page.getGameStyle())
                .coach(page.getCoach())
                .league(AppProperties.getInstance().getProperty("atp.league"))
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
                !AppProperties.getInstance().isPropertyEmpty("atp.url") &&
                !AppProperties.getInstance().isPropertyEmpty("atp.league") &&
                this.parameters != null;
    }

}
