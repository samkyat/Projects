package domain;

/**
 * Calculator domain model handling arithmetic operations.
 * Supports addition, subtraction, multiplication, and division.
 * Implements 14-digit precision with scientific notation for large results.
 */
public class Calculator{
    private String numA;
    private String operation;
    private String numB;

    public Calculator(){
        numA = null;
        operation = null;
        numB = null;
    }

    public void setNumA(String num){
        numA = num;
    }
    public void setNumB(String num){
        numB = num;
    }
    public void setOp(String op){
        operation = op;
    }

    public String getNumA(){
        return numA;
    }
    public String getNumB(){
        return numB;
    }

    public String getOp(){
        return operation;
    }
    
    /**
     * Evaluates the calculation (numA operation numB).
     * @return result of the operation or "Error" for division by zero
     */
    public String evaluate(){
        double A = Double.parseDouble(numA);
        double B = Double.parseDouble(numB);
        double result = 0;
        switch (operation) {
            case "+":
                result = A+B;
                break;
            case "-":
                result = A-B;
                break;
            case "x":
                result = A*B;
                break;
            case "÷":
                if (B == 0) {     
                    return "Error";
                }
                result = A/B;
                break;
            default:
                break;
        }
        return removeZeroDecimal(result);
    }

    /**
     * Formats a number for display, removing unnecessary decimals.
     * @param num the number to format
     * @return formatted string with max 14 characters or scientific notation
     */
    public String removeZeroDecimal(double num){
        if (num%1 == 0){
            String str = Long.toString((long) num);
            if (str.length()>14){
                str = String.format("%E", num);
            }
            return str;
        }
        String strDecimal = String.format("%.14g", num);
        if (strDecimal.length() > 14){
            strDecimal = String.format("%E", num);
        }
        return strDecimal;
    }
}
