package com.anitsuga.fwk.exception;

/**
 * FrontEndException
 * @author agustina.dagnino
 *
 */
public class FrontEndException extends RuntimeException {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 1L;


    /**
     * Constructor
     */
    public FrontEndException() {
        super();
    }
    
    /**
     * Constructor
     */
    public FrontEndException(String message) {
        super(message);
    }
    
    /**
     * Constructor
     */
    public FrontEndException(String message,Throwable t) {
        super(message,t);
    }
}
