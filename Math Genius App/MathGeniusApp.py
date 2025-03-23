'''
This is math app with two modes; 
 - Game mode is to challenge the user with different random math operations.
 - Pratice mode is to help the user to pratice a certain math operation.
'''

from math_modes import GameMode
from math_modes import PracticeMode

def start():
    user_name = input("Enter your name: ")

    while user_name == "":
        user_name = input("Please enter your name: ")

    print("Hi " + user_name.title() + ", Welcome to Math Plus.\n")
    run_app()

def run_app():
    print("Enter: \n'game' for Game mode\n'practice' for practice mode")

    mode_choice = input("Enter your choice: ")
    
    if mode_choice.lower() == "game":
        print("\nYou've chosen Game mode.")
        print("To quit, just type 'end'.\n")
        
        game_mode = GameMode(2)
        
        while mode_choice.lower() == "game":
            response = game_mode.game_question()
            if response == "end":
                mode_choice = "end"
                print(game_mode.summarize_score())
        
        
    elif mode_choice.lower() == "practice":
        practice_mode = PracticeMode(2, " ")
        
        operations = {"Add": "+", "Sub": "-", "Mult": "x", "Div": "÷"}
        
        print("\nYou've chosen Practice mode. To quit, just type 'end'.\n")
        print("To select:\n\tFor Addition: Enter 'Add'\n\tFor Subtraction: Enter 'Sub'\n\t"
          "For Multiplication: Enter 'Mult'\n\tFor Division: Enter 'Div'")
        
        op_choice = input("\nSelect your operation: ")
        
        while mode_choice == "practice":
            
            if not validate_practice_op(practice_mode, op_choice, operations):
                op_choice = input("\nSelect your operation: ")
            else: 
                response = practice_mode.practice_question()
                if response == "end":
                    mode_choice = "end"
                    print(practice_mode.summarize_score())
    else:
        print("INVALID CHOICE.")
        
    user_input = input("Do you want to play again [Y/N]: ")
    while user_input != "Y" and user_input != "N":
        print("Invalid choice\n")
        user_input = input("Do you want to play again [Y/N]: ")
    
    if user_input == "Y":
        run_app()
    else:
        return
    
def validate_practice_op(obj, op_choice, operations):
    if op_choice == "Add":
        obj.change_operation(operations["Add"])
    elif op_choice == "Sub":
        obj.change_operation(operations["Sub"])
    elif op_choice == "Mult":
        ob.change_operation(operations["Mult"])
    elif op_choice == "Div":
        obj.change_operation(operations["Div"])
    else:
        print("Sorry that operation is not included")
        return False
    return True
    
if __name__ == "__main__":
    start()