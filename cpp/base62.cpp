#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

string encodeBase62(long long num)
{
    string chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    string result = "";

    while(num > 0)
    {
        result += chars[num % 62];
        num /= 62;
    }

    reverse(result.begin(), result.end());

    return result;
}

int main()
{
    long long id;

    cout << "Enter Number: ";
    cin >> id;

    cout << "Short Code: "
         << encodeBase62(id)
         << endl;

    return 0;
}