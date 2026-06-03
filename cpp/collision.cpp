#include <iostream>
#include <unordered_set>

using namespace std;

int main()
{
    unordered_set<string> codes;

    codes.insert("abc123");

    string newCode = "abc123";

    if(codes.count(newCode))
    {
        cout << "Collision Detected"
             << endl;
    }
    else
    {
        cout << "Unique Code"
             << endl;
    }
}