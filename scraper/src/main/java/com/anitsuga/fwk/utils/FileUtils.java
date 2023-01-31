package com.anitsuga.fwk.utils;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.URL;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * FileUtils
 * @author agustina.dagnino
 *
 */
public class FileUtils {

    /**
     * logger
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(FileUtils.class.getName());
    
    /**
     * image
     */
    private static int count = 0;
    
    
    /**
     * getLocalPath
     * @return
     */
    public static String getLocalPath() {
        AppProperties config = AppProperties.getInstance();
        String localPath = config.getProperty("local.path");
        return localPath;
    }

    /**
     * downloadImage
     * @param remoteUrl
     * @param localPath
     */
    public static void downloadImage(String remoteUrl, String localPath) {
        try {
            
            URL url = new URL(remoteUrl);
            InputStream in = new BufferedInputStream(url.openStream());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[1024];
            int n = 0;
            while (-1!=(n=in.read(buf)))
            {
               out.write(buf, 0, n);
            }
            out.close();
            in.close();
            byte[] response = out.toByteArray();

            FileOutputStream fos = new FileOutputStream(localPath);
            fos.write(response);
            fos.close();

        } catch(Exception e) {
            LOGGER.error(e.getMessage(),e);
        }
    }
}
