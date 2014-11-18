package com.iderainc.yarn;

public final class IntegerUtil {

    /**
     * @param numberString
     *            the string to be parsed.
     * @return an Integer object holding the value represented by the string
     *         argument if the string cannot be parsed as an integer; Otherwise,
     *         return null.
     */
    static public Integer valueOf(String numberString) {
            Integer intNumber = null;
            if (null != numberString) {
                    try {
                            intNumber = Integer.valueOf(numberString);
                    } catch (NumberFormatException numberFormatException) {
                            intNumber = null; // Default if can't parse to Integer.
                    }
            }
            return intNumber;
    }

    /**
     * @param numberString
     *            a String containing the int representation to be parsed.
     * @return The integer value represented by the argument in decimal if the
     *         string contain a parsable integer; Otherwise, return null.
     */
    static public int parseInt(String numberString) {
            int intNumber = 0;
            if (null != numberString) {
                    try {
                            intNumber = Integer.parseInt(numberString);
                    } catch (NumberFormatException numberFormatException) {
                            intNumber = 0; // Default if can't parse to int.
                    }
            }
            return intNumber;
    }

    /**
     * Prevent constructor.
     */
    private IntegerUtil() {
    }

}
