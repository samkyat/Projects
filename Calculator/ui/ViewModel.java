package ui;
import domain.Calculator;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

public class ViewModel{
    private final Calculator calculator;
    private final StringProperty currNum;
    
    public ViewModel(Calculator calc){
        calculator = calc;
        currNum = new SimpleStringProperty("0");
    }

    public void updateA(){
        calculator.setNumA(currNum.getValue());
    }
    public void updateB(){
        calculator.setNumB(currNum.getValue());
    }
    public void updateB(String val){
        calculator.setNumB(val);
    }
    public void updateOp(String op){
        calculator.setOp(op);
    }

    public String getA(){
        return calculator.getNumA();
    }
    public String getB(){
        return calculator.getNumB();
    }

    public String getOp(){
        return calculator.getOp();
    }
    
    public StringProperty getNumProperty(){
        return currNum;
    }

    public void allClear(){
        calculator.setNumA(null);
        calculator.setNumB(null);
        calculator.setOp(null);
    }

    public void delete(){
        String currVal = currNum.getValue();
        if (currVal.length() == 1){
            currNum.setValue("0");
        }
        else{
            currNum.setValue(currVal.substring(0, currVal.length()-1));
        }
    }

    public void updateCurrNum(String val){
        String currVal = currNum.getValue();
        if (currVal.equals("0")){
            currNum.setValue(val);
        }
        else{
            currNum.setValue(currVal+val);
        }
    }

    public void signChange(){
        double curr = Double.parseDouble(currNum.getValue());
        curr *= -1;
        String curString = calculator.removeZeroDecimal(curr);
        currNum.setValue(curString);
    }
    
    public void calculate(){
        String val = calculator.evaluate();
        currNum.setValue(val);
    }
}