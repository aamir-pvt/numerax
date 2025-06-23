# Backend
This is the backend project for the stock screener. This contains the code needed to fetch information from the MongoDB project and make various analysis (through the c++ bindings) that will be used by the frontend.

## GETTING STARTED
1. Please make sure to get vcpkg working machine. Optionally, This project contains a submodule of vcpkg which could be cloned through git. The c++ code needed for analysis needs to be compiled before running the project. Please look below for more information about compiling the c++ code with vcpkg.
2. Make sure to create a `.env` file containing all the key value environments. Please check the `.env.example` file for all the environmnents needed for the project.
3. After compiling the c++ code, run `npm install` to install the needed dependencies.
4. Once everything is successful run `npm run start:dev` in the terminal to run the development server.

### GETTING VCPKG TO WORK
1. Please make sure you have cmake installed.
2. Because vcpkg is added as a submodule, make sure the ./backend/vcpkg folder is recursive cloned into the directory.
3. You would first need to execute the vcpkg/bootstrap-vcpkg.bat file to get vcpkg compiled for your system.

```shell
# For windows
.\vcpkg\bootstrap-vcpkg.bat
```
```shell
# For mac and linux
> ./vcpkg/bootstrap-vcpkg.sh
```
4. In order to install the packages need for the c++ bindings run the following executable. Please make sure you are in the backend directory. This command will use the vcpkg.json file to understand what packages to install and a new folder will be created called `./vcpkg_installed`. This install might take some time.
```shell
> cd backend
> ./vcpkg/vcpkg install
```
Note:
a. If you get an error please check the log files. It usually tells you what internal tools your computer requires in order to install some of the packages e.g you would need to make sure python is installed on your computer.

b. For more commands please check vcpkg's github repository here[](https://github.com/microsoft/vcpkg).

5. Once the these packages have been installed you can build the bindings using this command. In order to build the bindings please make sure you are in the backend directory
```shell
cd backend
> cmake -B build -S . "-DCMAKE_TOOLCHAIN_FILE=[path to vcpkg]/scripts/buildsystems/vcpkg.cmake"
> cmake --build build
```
[path to vcpkg] - absolute/relative path to the vcpkg folder

6.  Once built you can find the compiled bindings in `backend/build/ReportAnalysisNumeraxial.node`. This can then be used in the typescript/javascript code from the `./backend/src/bindings`.
7. In order to incorporate the building process with your IDE the vcpkg community provided some information (here)[https://github.com/microsoft/vcpkg]. They have information on how to incorporate the build with Visual Studio Code and CLion.
