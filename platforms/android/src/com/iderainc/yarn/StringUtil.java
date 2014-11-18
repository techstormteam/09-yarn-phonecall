package com.iderainc.yarn;

public final class StringUtil {

    /**
     * Indicate whether the string is null or empty.
     * 
     * @param str
     *            a String object
     * @return boolean indicating whether the string is null or empty.
     */
    static public boolean isNullOrEmpty(String str) {
            return null == str || str.isEmpty();
    }

    /**
     * Prevent constructor.
     */
    private StringUtil() {
    }

}