# 1. Install meteor on Raspberry Pi

Get Meteor universal (e.g. into your $HOME):
```
cd ~
git clone --depth 1 https://github.com/4commerce-technologies-AG/meteor.git
```

Check installed version:
```
~/meteor/meteor --version
```

Create symlink in bin directory
```
ln -s ~/meteor/meteor /usr/bin/meteor
```

# 2. Clone weBrew repository
```
cd ~
git clone https://github.com/plapczyn/webrew.git
```
