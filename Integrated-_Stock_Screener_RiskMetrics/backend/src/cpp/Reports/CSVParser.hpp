#ifndef _CSVPARSER_HPP_
#define _CSVPARSER_HPP_

#include <stdexcept>
#include <string>
#include <vector>
#include <list>
#include <sstream>

// user's Guides
//  Input: filename.csv
//  file[][]: string tpye; file[]: row class

// Example
/*
int main(int argc, char **argv)
{
try
{
Parser file = Parser("files/readme.csv");

std::cout << file[0][0] << std::endl; // display : 1997
std::cout << file[0] << std::endl; // display : 1997 | Ford | E350

std::cout << file[1]["Model"] << std::endl; // display : Cougar

std::cout << file.rowCount() << std::endl; // display : 2
std::cout << file.columnCount() << std::endl; // display : 3

std::cout << file.getHeaderElement(2) << std::endl; // display : Model
}
catch (csv::Error &e)
{
std::cerr << e.what() << std::endl;
}
return 0;
}*/

using namespace std;

class CustomError : public std::runtime_error
{

public:
	CustomError(const std::string &msg) : std::runtime_error(std::string("CSVparser : ").append(msg))
	{
	}
};

class Row
{
public:
	Row(const std::vector<std::string> &);
	~Row(void);

public:
	unsigned int size(void) const;
	void push(const std::string &);
	bool set(const std::string &, const std::string &);

private:
	const std::vector<std::string> _header;
	std::vector<std::string> _values;

public:
	template <typename T>
	const T getValue(unsigned int pos) const
	{
		if (pos < _values.size())
		{
			T res;
			std::stringstream ss;
			ss << _values[pos];
			ss >> res;
			return res;
		}
		throw CustomError("can't return this value (doesn't exist)");
	}
	const std::string operator[](unsigned int) const;
	const std::string operator[](const std::string &valueName) const;
	friend std::ostream &operator<<(std::ostream &os, const Row &row);
	friend std::ofstream &operator<<(std::ofstream &os, const Row &row);
};

enum DataType
{
	eFILE = 0,
	ePURE = 1
};

class Parser
{

public:
	Parser(const std::string &, const DataType &type = eFILE, char sep = ',');
	~Parser(void);

public:
	Row &getRow(unsigned int row) const;
	unsigned int rowCount(void) const;
	unsigned int columnCount(void) const;
	std::vector<std::string> getHeader(void) const;
	const std::string getHeaderElement(unsigned int pos) const;
	const std::string &getFileName(void) const;

public:
	bool deleteRow(unsigned int row);
	bool addRow(unsigned int pos, const std::vector<std::string> &);
	void sync(void) const;

protected:
	void parseHeader(void);
	void parseContent(void);

private:
	std::string _file;
	const DataType _type;
	const char _sep;
	std::vector<std::string> _originalFile;
	std::vector<std::string> _header;
	std::vector<Row *> _content;

public:
	Row &operator[](unsigned int row) const;
};

#endif /*!_CSVPARSER_HPP_*/
#pragma once
