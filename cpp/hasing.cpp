#include <iostream>
#include <string>
#include <functional>

using namespace std;

int main()
{
    string url;

    cout << "Enter URL: ";
    getline(cin, url);

    size_t hashValue = hash<string>{}(url);

    cout << "Hash Value: "
         << hashValue
         << endl;
}
