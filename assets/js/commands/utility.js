// Utility Commands Module
// Useful utility commands

if (window.terminal) {
  // Time command
  window.terminal.registerCommand("time", "Display current time", () => {
    const now = new Date();
    window.terminal.print(`Current time: ${now.toLocaleString()}`);
  });

  // Calculator command
  window.terminal.registerCommand("calc", "Simple calculator", (args) => {
    if (args.length === 0) {
      window.terminal.printError("Usage: calc <expression>");
      window.terminal.print("Example: calc 5 + 3");
      return;
    }

    try {
      const expression = args.join(" ");
      // Note: eval is dangerous in production! This is just for demo purposes
      const result = eval(expression);
      window.terminal.printSuccess(`Result: ${result}`);
    } catch (error) {
      window.terminal.printError("Invalid expression");
    }
  });

  // Demo command
  // window.terminal.registerCommand("demo", "Show demo content", () => {
  //   window.terminal.printSuccess("=== Demo Content ===");
  //   window.terminal.print("");
  //   window.terminal.print("This is regular text");
  //   window.terminal.printInfo("This is info text");
  //   window.terminal.printWarning("This is warning text");
  //   window.terminal.printError("This is error text");
  //   window.terminal.print("");
  //   window.terminal.printHTML(
  //     'You can also use <strong>HTML</strong> with <a href="#">links</a>!',
  //   );
  // });

  // ASCII art command
  // window.terminal.registerCommand("ascii", "Display ASCII art", () => {
  //   const art = `
  //      _____                   _             _
  //     |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
  //       | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
  //       | |  __/ |  | | | | | | | | | | (_| | |
  //       |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|
  //     `;
  //   window.terminal.print(art, "success");
  // });

  // ASCII art command
  window.terminal.registerCommand("nerv", "Display NERV logo", () => {
    const art = `
                                           #  ## %*###                      
                                     #******************                    
                                   #*******************                     
                                   ********************                     
                    %*             **************************               
                    ***           #*****************************            
                      **          *******************************%          
                        *#        *********************************         
                         %*     %************************************       
                           ******************************************       
                             *************************************          
                               **********************# ******#*             
           ***        *%    %** %**********************                     
           *%**#      *      **   #*************************                
           *  ***     *      **     *************************               
           *   %**#   *      **#####*************************#              
           *     ***  *      **      * %**********************%             
           *      %**#*      **          #*********************             
           *        ***      **        %%  ********************#            
           *%        %*     %**       **     *******************            
                                              %******************           
                               #********#    #*******************           
                                 **     #**    ******************           
                                 **      **#    *** *************#          
                                 **     #**      **#  ************          
                                 *******#         **%  %**********          
                                 **  %**           **  *%#*******#          
                                 **    ***         #**#*   ******           
                                 **     #**%        ***      ****#          
                               %****%     ***%       *        %***          
                                                                #*          
                                                                		
    `;
    window.terminal.print(art, "success");
  });

  // Greet command
  window.terminal.registerCommand("greet", "Greet the user", (args) => {
    const name = args.length > 0 ? args.join(" ") : "User";
    window.terminal.printSuccess(`Hello, ${name}! Welcome to the terminal.`);
  });
}
