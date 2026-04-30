package ui;
import domain.Calculator;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

public class ViewModel{
    private final Calculator calculator;
    private final StringProperty currNum;
    private boolean startNewNumber = false;
    
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
        startNewNumber = true;
    }

    public void delete(){
        if (currNum.getValue().equals("Error")) {
            currNum.setValue("0");
            return;
        }
        String currVal = currNum.getValue();
        if (currVal.length() == 1){
            currNum.setValue("0");
        }
        else{
            currNum.setValue(currVal.substring(0, currVal.length()-1));
        }
    }

    public void updateCurrNum(String val){
        if (currNum.getValue().equals("Error")) {
            currNum.setValue(val);
            return;
        }
        if (startNewNumber) {
            currNum.setValue(val);
            startNewNumber = false;
        } else {
            String currVal = currNum.getValue();
            if (currVal.length() <= 14){
                if (currVal.equals("0")){
                    currNum.setValue(val);
                }
                else{
                    currNum.setValue(currVal+val);
                }
            }
        }
    }

    public void signChange(){
        if (currNum.getValue().equals("Error")) {
            currNum.setValue("0");
            return;
        }
        if (currNum.getValue().equals("0")) {
            return;
        }
        double curr = Double.parseDouble(currNum.getValue());
        curr *= -1;
        String curString = calculator.removeZeroDecimal(curr);
        currNum.setValue(curString);
    }

    public void percentage(){
        if (currNum.getValue().equals("Error")) {
            currNum.setValue("0");
            return;
        }
        if (currNum.getValue().equals("0")) {
            return;
        }
        double curr = Double.parseDouble(currNum.getValue());
        curr /= 100.0;
        String curString = calculator.removeZeroDecimal(curr);
        currNum.setValue(curString);
    }
    
    public void calculate(){
        String val = calculator.evaluate();
        currNum.setValue(val);
        if (val.equals("Error")) {
            calculator.setNumA(null);
            calculator.setNumB(null);
            calculator.setOp(null);
            startNewNumber = true;
        }
    }

    public void handleOperator(String op) {
        if (currNum.getValue().equals("Error")) {
            allClear();
            currNum.setValue("0");
            return;
        }
        if (getOp() == null) {
            updateA();
            currNum.setValue("0");
            updateB("0");
            updateOp(op);
            startNewNumber = true;
        } else if (!currNum.getValue().equals("0")) {
            updateB();
            calculate();
            if (!currNum.getValue().equals("Error")) {
                updateA();
                updateB("0");
                updateOp(op);
                startNewNumber = true;
            }
        } else {
            updateOp(op);
        }
    }
}
