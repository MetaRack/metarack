sudo iptables -t nat -A PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 4443
sudo iptables -t nat -A PREROUTING -p tcp --dport 80  -j REDIRECT --to-port 8080