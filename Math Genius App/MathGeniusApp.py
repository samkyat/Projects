#This is math app with two modes; 
#Game mode is to challenge the user with different random math operations.
#Pratice mode is to help the user to pratice a certain math operation.

import random

user_name = input("Enter your name: ")

while user_name == "": # App only starts after user name has an input
    user_name = input("Please enter your name: ")

print("Hi " + user_name.title() + ", Welcome to Math Plus.\n")
    
score = 0 

questions = 0

print("Enter: \n'a' for Game mode\n'b' for practice mode")

choice = input("Enter your choice: ")

if choice == "a":

    print("\nYou've chosen Game mode.")
    
    print("To quit, just type 'end'.\n")
    
    while choice == "a":
    
        q_1 = random.randrange(0, 101)
        
        q_2 = random.randrange(0, 101)
        
        operations = ["-", "+", "x", "/"]
        
        oper_choice = random.choice(operations)

        your_answer = input(f"{q_1} {oper_choice} {q_2} = ")
        
        if your_answer == "end":
        
            print(f"\nYour score is {score}/{questions}")
            choice = "end"
        else:
            your_answer = float(your_answer);
        

        if oper_choice == "-":
        
            ans_1 = (q_1 - q_2)
            questions += 1
            
            if your_answer == ans_1:
            
                print("You're correct\n")
                score += 1
                
            elif your_answer == "end":
                pass
            else:
            
                print("You're not correct")
                print(f"The answer is {ans_1}.\n")

        elif oper_choice == "+":
        
            ans_2 = (q_1 + q_2)
            questions += 1
            
            if your_answer == ans_2:
            
                print("You're correct\n")
                score += 1
                
            elif your_answer == "end":
                pass
            else:
            
                print("You're not correct")
                print(f"The answer is {ans_2}.\n")

        elif oper_choice == "x":
        
            ans_3 = (q_1 * q_2)
            questions += 1
            
            if your_answer == ans_3:
            
                print("You're correct\n")
                score += 1
                
            elif your_answer == "end":
                pass
            else:
            
                print("You're not correct")
                print(f"The answer is {ans_3}.\n")

        elif oper_choice == "/":
        
            ans_4 = round(q_1 / q_2, 2)
            questions += 1
            # This is the problem here. ans_4 keeps rounding up to big long digits and 
            # the possible solution could round(ans_4,3), fixed!!

            if your_answer == ans_4:
            
                print("You're correct\n")
                score += 1
                
            elif your_answer == "end":
                pass
            else:
            
                print("You're not correct")
                print(f"The answer is {ans_4}.\n")
        else:
            pass

    else:
        pass

elif choice == "b":

    print("\nYou've chosen Practice mode.")
    
    print("To select:\n\tFor Addition: Enter 'Add'\n\tFor Subtraction: Enter 'Sub'\n\t"
          "For Multiplication: Enter 'Mult'\n\tFor Division: Enter 'Div'")

    opera_choice = input("\nSelect your operation: ")
    
    practice = 0
    
    scorep = 0
    
    Add = "Addition Practice."
    
    Sub = "Subtraction Practice."
    
    Mult = "Multiplication Practice."
    
    Div = "Division Practice."

    while choice == "b":
    
        p_1 = random.randrange(0, 100)
        
        p_2 = random.randrange(0, 100)
        
        if opera_choice == "Add":
        
            addition = int(input(f"{p_1} + {p_2}= "))
            practice += 1
            
            if addition == (p_1 + p_2):
            
                print("You're correct")
                scorep += 1
                
            elif practice == 20:
            
                print(f"You got {scorep}/{practice} in {Add}")
                choice = "end"
                
            else:
            
                print("You're not correct")
                print("Answer is " + str(sum([p_1, p_2])))

            print()
            
        elif opera_choice == "Sub":
        
            subtraction = input(f"{p_1} - {p_2}= ")
            practice += 1
            
            if subtraction == (p_1 - p_2):
            
                print("You're correct")
                scorep += 1
                
            elif practice == 20:
            
                print(f"You got {scorep}/{practice} in {Sub}")
                choice = "end"
                
            else:
            
                print("You're not correct")
                print("Answer is " + str(p_1 - p_2))

            print()
            
        elif opera_choice == "Mult":
        
            multi_p = input(f"{p_1} x {p_2}= ")
            practice += 1
            
            if multi_p == (p_1 * p_2):
            
                print("You're correct")
                scorep += 1
                
            elif practice == 20:
            
                print(f"You got {scorep}/{practice} in {Mult}")
                choice = "end"
                
            else:
            
                print("You're not correct")
                print("Answer is " + str(p_1 * p_2))
            
            print()

        elif opera_choice == "Div":
        
            division = input(f"{p_1} / {p_2}= ")
            
            div_ans = round(p_1/p_2, 2)
            
            practice += 1
            
            if division == div_ans:
            
                print("You're correct")
                scorep += 1
                
            elif practice == 20:
            
                print(f"You got {scorep}/{practice} in {Div}")
                choice = "end"
                
            else:
            
                print("You're not correct")
                print("Answer is " + str(div_ans))
            
            print()

        else:
        
            print("Sorry that operation is not included")
            opera_choice = input("\nSelect your operation: ")

else:
    print("INVALID CHOICE.")
