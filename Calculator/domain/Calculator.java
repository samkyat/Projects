package domain;

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
                result = A/B;
                break;
            case "%":
                result = A/100;
                break;
            default:
                break;
        }
        return removeZeroDecimal(result);
    }

    public String removeZeroDecimal(double num){
        if (num%1 == 0){
            return Integer.toString((int) num);
        }
        return Double.toString(num);
    }
}