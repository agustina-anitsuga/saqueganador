package com.anitsuga.robot.types;

import com.anitsuga.fwk.page.Page;
import com.anitsuga.fwk.utils.AppProperties;
import com.anitsuga.robot.AbstractRobot;
import com.anitsuga.robot.RobotType;
import com.anitsuga.robot.model.Content;
import com.anitsuga.robot.model.Player;
import com.anitsuga.robot.page.WTAPlayerPage;
import org.openqa.selenium.WebDriver;

/**
 * WTAPlayerRobot
 * @author agustina.dagnino
 */
public class WTAPlayerRobot extends AbstractRobot {

    /**
     * WTAPlayerRobot
     * @param robotType
     * @param parameters
     */
    public WTAPlayerRobot(RobotType robotType, Object... parameters) {
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
        WTAPlayerPage page = new WTAPlayerPage(driver);
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
        WTAPlayerPage page = (WTAPlayerPage) contentPage;
        page.waitUntilLoaded();
        Player player = Player.builder()
                .firstName(page.getFirstName())
                .lastName(page.getLastName())
                .fullName(page.getFullName())
                .birthPlace(page.getBirthPlace())
                .gameStyle(page.getGameStyle())
                .heightInCm(page.getHeightInCm())
                .birthDate(page.getBirthDate())
                .profilePicUrl(page.getProfilePicUrl())
                .ranking(page.getRanking())
                .winRatio(page.getWinRatio())
                .nationality(page.getNationality())
                .leagueProfileUrl(url)
                .biography(page.getBiography())
                .league(AppProperties.getInstance().getProperty("wta.league"))
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
                !AppProperties.getInstance().isPropertyEmpty("wta.url") &&
                !AppProperties.getInstance().isPropertyEmpty("wta.league") &&
                this.parameters != null;
    }
}
