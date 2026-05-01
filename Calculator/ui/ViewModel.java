package ui;

import domain.Calculator;
import javafx.beans.property.SimpleStringProperty;
import javafx.beans.property.StringProperty;

/**
 * ViewModel for the Calculator UI.
 * Manages display state and handles user input processing.
 */
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
        if (isError()) {
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

    /**
     * Updates the current number being displayed.
     * @param val digit or decimal point to add
     */
    public void updateCurrNum(String val){
        if (isError()) {
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

    /**
     * Toggles the sign of the current number.
     */
    public void signChange(){
        if (isError() || isZero()) {
            return;
        }
        double curr = Double.parseDouble(currNum.getValue());
        curr *= -1;
        String curString = calculator.removeZeroDecimal(curr);
        currNum.setValue(curString);
    }

    /**
     * Converts the current number to its percentage equivalent.
     */
    public void percentage(){
        if (isError() || isZero()) {
            return;
        }
        double curr = Double.parseDouble(currNum.getValue());
        curr /= 100.0;
        String curString = calculator.removeZeroDecimal(curr);
        currNum.setValue(curString);
    }
    
    /**
     * Performs the pending calculation and displays result.
     */
    public void calculate(){
        String val = calculator.evaluate();
        currNum.setValue(val);
        if (isError()) {
            calculator.setNumA(null);
            calculator.setNumB(null);
            calculator.setOp(null);
            startNewNumber = true;
        }
    }

    /**
     * Handles operator button presses with chaining support.
     * @param op the operator symbol (+, -, x, ÷)
     */
    public void handleOperator(String op) {
        if (isError()) {
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
            if (!isError()) {
                updateA();
                updateB("0");
                updateOp(op);
                startNewNumber = true;
            }
        } else {
            updateOp(op);
        }
    }

    /**
     * Helper method to check if current display shows error.
     */
    private boolean isError() {
        return currNum.getValue().equals("Error");
    }

    /**
     * Helper method to check if current number is zero.
     */
    private boolean isZero() {
        return currNum.getValue().equals("0");
    }
}
